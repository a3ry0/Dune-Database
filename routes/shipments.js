const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

// Route: GET /Shipments - List all shipments and shipment-silo associations
router.get('/', function(req, res) {
  let shipmentsQuery = "SELECT * FROM Shipments;";

  let ordersQuery = `SELECT order_id FROM Orders ORDER BY order_id ASC;`;

  let silosQuery = `SELECT silo_id, city FROM Spice_Silos ORDER BY silo_id ASC;`;

  let associationsQuery = `
  SELECT ss.shipment_silo_id, ss.shipment_id, ss.silo_id, sh.carrier, sp.city
  FROM Shipments_Spice_Silos ss
  JOIN Shipments sh ON ss.shipment_id = sh.shipment_id
  JOIN Spice_Silos sp ON ss.silo_id = sp.silo_id
  ORDER BY ss.shipment_silo_id ASC;
  `;

  db.pool.query(shipmentsQuery, function(error, shipmentsRows, fields) {
    if (error) {
      console.log("Error fetching shipments:", error);
      return res.sendStatus(500);
    }

    db.pool.query(associationsQuery, function(error, associationRows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }  
    
      // Get orders for dropdown
      db.pool.query(ordersQuery, function(error, ordersRows, fields) {
        if (error) {
          console.log("Error fetching orders:", error);
          return res.sendStatus(500);
        }
        
        // Get Silos for dropdown
        db.pool.query(silosQuery, function(error, silosRows, fields) {
          if (error) {
            console.log("Error fetching orders:", error);
            return res.sendStatus(500);
          }

      
        // Format dates
        shipmentsRows.forEach(row => {
          if (row.shipment_date) {
            row.shipment_date = new Date(row.shipment_date).toISOString().split('T')[0];
          }
        });

        // Create more readable description for associations
        associationRows.forEach(row => {
          row.shipment_info = `Shipment ${row.shipment_id} - Carrier ${row.carrier}`;
          row.silo_info = `Silo ${row.silo_id} (${row.city})`;
        });

      
          res.render('shipments', { 
            data: shipmentsRows,
            associations: associationRows,
            silos: silosRows,
            orders: ordersRows
          });
        });
      });
    });
  });
});


// Route: POST /shipments/add-shipment-ajax - Add a new shipment
router.post('/add-shipment-ajax', function(req, res) {
  let data = req.body;
  
  // Validate input data
  if (!data.order_id || !data.shipment_date || !data.quantity || !data.carrier || !data.tracking_number || !data.shipment_status) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  let query1 = `INSERT INTO Shipments (order_id, shipment_date, quantity, carrier, tracking_number, shipment_status) VALUES (?, ?, ?, ?, ?, ?)`;

  db.pool.query(query1, [data.order_id, data.shipment_date, data.quantity, data.carrier, data.tracking_number, data.shipment_status], function(error, results, fields) {
    if (error) {
      console.log("Database insert error:", error);
      return res.status(400).json({ error: "Database insert error" });
    } else {
      // Get the newly inserted ID
      const newId = results.insertId;
      console.log("New shipment inserted with ID:", newId);
      
      // Query to retrieve the newly inserted shipment
      let query2 = `SELECT * FROM Shipments WHERE shipment_id = ?`;
      
      db.pool.query(query2, [newId], function(error, rows, fields) {
        if (error) {
          console.log("Error fetching new shipment:", error);
          return res.status(400).json({ error: "Error fetching new shipment" });
        } else {
          if (rows.length > 0) {
            console.log("Sending back shipment data:", rows[0]);
            return res.status(200).json(rows[0]);
          } else {
            console.log("No shipment found with ID:", newId);
            return res.status(404).json({ error: "Shipment not found after insert" });
          }
        }
      });
    }
  });
});

// Route: PUT /shipments/put-shipment-ajax - Update a shipment
router.put('/put-shipment-ajax', function(req, res, next){
  let data = req.body;
  let shipment_id = parseInt(data.shipment_id);
  let order_id = parseInt(data.order_id);
  let shipment_date = data.shipment_date;
  let quantity = parseInt(data.quantity);
  let carrier = data.carrier;
  let tracking_number = data.tracking_number;
  let shipment_status = data.shipment_status;

  let queryUpdateShipment = `UPDATE Shipments SET order_id = ?, shipment_date = ?, quantity = ?, carrier = ?, tracking_number = ?, shipment_status = ? WHERE shipment_id = ?`;

  // Validate input data
  if (!data.order_id || !data.shipment_date || !data.quantity || !data.carrier || !data.tracking_number || !data.shipment_status) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.pool.query(queryUpdateShipment, [order_id, shipment_date, quantity, carrier, tracking_number, shipment_status, shipment_id], function(error, rows, fields){
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      let querySelectUpdated = `SELECT * FROM Shipments WHERE shipment_id = ?`;
      db.pool.query(querySelectUpdated, [shipment_id], function(error, updatedRows, fields){
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          if (updatedRows.length > 0) {
            // Format date for JSON response
            let updatedShipment = updatedRows[0];
            console.log("Sending back updated shipment data:", updatedShipment);
            return res.status(200).json(updatedShipment);
          } else {
            return res.status(404).json({ error: "Shipment not found after update" });
          }
        }
      });
    }
  });
});

// Route: DELETE /shipments/delete-shipment-ajax - Delete a shipment
router.delete('/delete-shipment-ajax', function(req,res, next){
  let data = req.body;

  let shipment_id = parseInt(data.id);
  let deleteShipment= `DELETE FROM Shipments WHERE shipment_id = ?`;
  
  db.pool.query(deleteShipment, [shipment_id], function(error, rows, fields){
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// ====== shipment-silo association routes ======

// Route: POST /shipments/add-shipment-silo-ajax - Add a new shipment-silo association
router.post('/add-shipment-silo-ajax', function(req, res) {
  let data = req.body;
  
  // Debug logging
  console.log("Received POST request with data:", data);
  
  // Validate input data
  if (!data.shipment_id || !data.silo_id) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  // First, check if this association already exists to avoid duplicates
  let checkQuery = `
    SELECT * FROM Shipments_Spice_Silos 
    WHERE shipment_id = ? AND silo_id = ?
  `;
  
  db.pool.query(checkQuery, [data.shipment_id , data.silo_id], function(error, checkResults) {
    if (error) {
      console.log("Database check error:", error);
      return res.status(400).json({ error: "Database check error" });
    }
    
    if (checkResults.length > 0) {
      return res.status(400).json({ error: "This shipment-silo association already exists" });
    }
    
    // Association doesn't exist, so create it
    let insertQuery = `
      INSERT INTO Shipments_Spice_Silos (shipment_id, silo_id) 
      VALUES (?, ?)
    `;
    
    db.pool.query(insertQuery, [data.shipment_id, data.silo_id], function(error, results) {
      if (error) {
        console.log("Database insert error:", error);
        return res.status(400).json({ error: "Database insert error" });
      }
      
      // Get the newly inserted ID
      const newId = results.insertId;
      
      // Query to retrieve the newly inserted association with details
      let selectQuery = `
      SELECT ss.shipment_silo_id, ss.shipment_id, ss.silo_id, sh.carrier, sp.city
      FROM Shipments_Spice_Silos ss
      JOIN Shipments sh ON ss.shipment_id = sh.shipment_id
      JOIN Spice_Silos sp ON ss.silo_id = sp.silo_id
      WHERE ss.shipment_silo_id = ?
      `;
      
      db.pool.query(selectQuery, [newId], function(error, rows) {
        if (error) {
          console.log("Error fetching new association:", error);
          return res.status(400).json({ error: "Error fetching new association" });
        }
        
        if (rows.length > 0) {
          let newAssociation = rows[0];
          
          // Create more readable description
          newAssociation.shipment_info = `Shipment ${newAssociation.shipment_id} - Carrier ${newAssociation.carrier}`;
          newAssociation.silo_info = `Silo ${newAssociation.silo_id} (${newAssociation.city})`;
          
          console.log("Sending back association data:", newAssociation);
          return res.status(200).json(newAssociation);
        } else {
          return res.status(404).json({ error: "Association not found after insert" });
        }
      });
    });
  });
});


// Route: DELETE /shipments/delete-shipment-silo-ajax - Delete a shipment-silo association
router.delete('/delete-shipment-silo-ajax', function(req, res) {
  let data = req.body;
  
  // Debug logging
  console.log("Received DELETE request with data:", data);
  
  let association_id = parseInt(data.id);
  
  // Validate input
  if (!association_id) {
    console.log("Missing association ID");
    return res.status(400).json({ error: "Missing association ID" });
  }
  
  let deleteQuery = `DELETE FROM Shipments_Spice_Silos WHERE shipment_silo_id = ?`;
  
  db.pool.query(deleteQuery, [association_id], function(error, result) {
    if (error) {
      console.log("Delete error:", error);
      return res.status(400).json({ error: "Database delete error" });
    }
    
    console.log("Association deleted successfully");
    return res.sendStatus(204);
  });
});

module.exports = router;
