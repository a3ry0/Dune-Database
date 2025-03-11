const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

// Route: GET /Shipments - List all shipments
router.get('/', function(req, res) {
  let query = "SELECT * FROM Shipments;";
  db.pool.query(query, function(error, rows, fields) {
    if (error) {
      console.log(error);
      return res.sendStatus(500);
    } else {
      rows.forEach(row => {
        if (row.shipment_date) {
          // Convert to YYYY-MM-DD format
          row.shipment_date = row.shipment_date.toISOString().split('T')[0];
        }
      });
      return res.render('shipments', { data: rows });
    }
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

module.exports = router;