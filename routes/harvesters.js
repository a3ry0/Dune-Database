const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

// Route: GET /harvesters - List all harvesters and harvester-silo associations
router.get('/', function(req, res) {
  // Query for harvesters
  let harvestersQuery = "SELECT * FROM Harvesters ORDER BY harvester_id ASC;";
  
  // Query for harvesters-silos relationships with details
  let associationsQuery = `
    SELECT hs.harvester_silo_id, hs.harvester_id, hs.silo_id,
           h.model, h.base_city, s.city, s.spice_capacity
    FROM Harvesters_Spice_Silos hs
    JOIN Harvesters h ON hs.harvester_id = h.harvester_id
    JOIN Spice_Silos s ON hs.silo_id = s.silo_id
    ORDER BY hs.harvester_silo_id ASC;
  `;

  // Query for all spice silos (for dropdown)
  let silosQuery = "SELECT * FROM Spice_Silos ORDER BY silo_id ASC;";
  
  // Execute first query
  db.pool.query(harvestersQuery, function(error, harvesterRows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }
    
    // Execute second query
    db.pool.query(associationsQuery, function(error, associationRows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      
      // Execute third query
      db.pool.query(silosQuery, function(error, siloRows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(500);
          return;
        }
        
        // Format dates for display
        harvesterRows.forEach(row => {
          if (row.last_maintenance_date) {
            row.last_maintenance_date = new Date(row.last_maintenance_date).toISOString().split('T')[0];
          }
        });
        
        // Create more readable description for associations
        associationRows.forEach(row => {
          row.harvester_info = `${row.model} (${row.base_city})`;
          row.silo_info = `Silo ${row.silo_id} (${row.city}, Capacity: ${row.spice_capacity})`;
        });
        
        res.render('harvesters', { 
          data: harvesterRows,
          associations: associationRows,
          silos: siloRows
        });
      });
    });
  });
});

// Route: POST /harvesters/add-harvester-ajax - Add a new harvester
router.post('/add-harvester-ajax', function(req, res) {
  let data = req.body;
  
  // Validate input data
  if (!data.base_city || !data.model || !data.team_captain || !data.total_harvested) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  let query1 = `INSERT INTO Harvesters 
    (base_city, model, team_captain, last_maintenance_date, total_harvested) 
    VALUES (?, ?, ?, ?, ?)`;
  
  db.pool.query(query1, [
    data.base_city, 
    data.model, 
    data.team_captain, 
    data.last_maintenance_date || null, 
    data.total_harvested
  ], function(error, results, fields) {
    if (error) {
      console.log("Database insert error:", error);
      return res.status(400).json({ error: "Database insert error" });
    } else {
      // Get the newly inserted ID
      const newId = results.insertId;
      
      // Query to retrieve the newly inserted harvester
      let query2 = `SELECT * FROM Harvesters WHERE harvester_id = ?`;
      
      db.pool.query(query2, [newId], function(error, rows, fields) {
        if (error) {
          console.log("Error fetching new harvester:", error);
          return res.status(400).json({ error: "Error fetching new harvester" });
        } else {
          if (rows.length > 0) {
            const newHarvester = rows[0];
            // Format date for JSON response
            if (newHarvester.last_maintenance_date) {
              newHarvester.last_maintenance_date = new Date(newHarvester.last_maintenance_date).toISOString().split('T')[0];
            }
            return res.status(200).json(newHarvester);
          } else {
            return res.status(404).json({ error: "Harvester not found after insert" });
          }
        }
      });
    }
  });
});

// Route: PUT /harvesters/put-harvester-ajax - Update a harvester
router.put('/put-harvester-ajax', function(req, res, next){
  let data = req.body;
  let harvester_id = parseInt(data.harvester_id);
  let base_city = data.base_city;
  let model = data.model;
  let team_captain = data.team_captain;
  let last_maintenance_date = data.last_maintenance_date;
  let total_harvested = data.total_harvested;

  let queryUpdateHarvester = `UPDATE Harvesters 
    SET base_city = ?, model = ?, team_captain = ?, last_maintenance_date = ?, total_harvested = ? 
    WHERE harvester_id = ?`;

  db.pool.query(queryUpdateHarvester, [
    base_city, 
    model, 
    team_captain, 
    last_maintenance_date || null, 
    total_harvested, 
    harvester_id
  ], function(error, rows, fields){
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      let querySelectUpdated = `SELECT * FROM Harvesters WHERE harvester_id = ?`;
      db.pool.query(querySelectUpdated, [harvester_id], function(error, updatedRows, fields){
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          if (updatedRows.length > 0) {
            // Format date for JSON response
            let harvester = updatedRows[0];
            if (harvester.last_maintenance_date) {
              harvester.last_maintenance_date = new Date(harvester.last_maintenance_date).toISOString().split('T')[0];
            }
            return res.status(200).json(harvester);
          } else {
            return res.status(404).json({ error: "Harvester not found after update" });
          }
        }
      });
    }
  });
});

// Route: DELETE /harvesters/delete-harvester-ajax - Delete a harvester
router.delete('/delete-harvester-ajax', function(req,res, next){
  let data = req.body;
  let harvester_id = parseInt(data.id);
  let deleteHarvester= `DELETE FROM Harvesters WHERE harvester_id = ?`;
  
  db.pool.query(deleteHarvester, [harvester_id], function(error, rows, fields){
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// ====== harvester-silo association routes ======

// Route: POST /harvesters/add-harvester-silo-ajax - Add a new harvester-silo association
router.post('/add-harvester-silo-ajax', function(req, res) {
  let data = req.body;
  
  // Debug logging
  console.log("Received POST request with data:", data);
  
  // Validate input data
  if (!data.harvester_id || !data.silo_id) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  // First, check if this association already exists to avoid duplicates
  let checkQuery = `
    SELECT * FROM Harvesters_Spice_Silos 
    WHERE harvester_id = ? AND silo_id = ?
  `;
  
  db.pool.query(checkQuery, [data.harvester_id, data.silo_id], function(error, checkResults) {
    if (error) {
      console.log("Database check error:", error);
      return res.status(400).json({ error: "Database check error" });
    }
    
    if (checkResults.length > 0) {
      return res.status(400).json({ error: "This harvester-silo association already exists" });
    }
    
    // Association doesn't exist, so create it
    let insertQuery = `
      INSERT INTO Harvesters_Spice_Silos (harvester_id, silo_id) 
      VALUES (?, ?)
    `;
    
    db.pool.query(insertQuery, [data.harvester_id, data.silo_id], function(error, results) {
      if (error) {
        console.log("Database insert error:", error);
        return res.status(400).json({ error: "Database insert error" });
      }
      
      // Get the newly inserted ID
      const newId = results.insertId;
      
      // Query to retrieve the newly inserted association with details
      let selectQuery = `
        SELECT hs.harvester_silo_id, hs.harvester_id, hs.silo_id,
               h.model, h.base_city, s.city, s.spice_capacity
        FROM Harvesters_Spice_Silos hs
        JOIN Harvesters h ON hs.harvester_id = h.harvester_id
        JOIN Spice_Silos s ON hs.silo_id = s.silo_id
        WHERE hs.harvester_silo_id = ?
      `;
      
      db.pool.query(selectQuery, [newId], function(error, rows) {
        if (error) {
          console.log("Error fetching new association:", error);
          return res.status(400).json({ error: "Error fetching new association" });
        }
        
        if (rows.length > 0) {
          let newAssociation = rows[0];
          
          // Create more readable description
          newAssociation.harvester_info = `${newAssociation.model} (${newAssociation.base_city})`;
          newAssociation.silo_info = `Silo ${newAssociation.silo_id} (${newAssociation.city}, Capacity: ${newAssociation.spice_capacity})`;
          
          console.log("Sending back association data:", newAssociation);
          return res.status(200).json(newAssociation);
        } else {
          return res.status(404).json({ error: "Association not found after insert" });
        }
      });
    });
  });
});

// Route: PUT /harvesters/put-harvester-silo-ajax - Update a harvester-silo association
router.put('/put-harvester-silo-ajax', function(req, res) {
  let data = req.body;
  
  // Debug logging
  console.log("Received PUT request for harvester-silo with data:", data);
  
  // Validate input data
  if (!data.harvester_silo_id || !data.harvester_id || !data.silo_id) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  let association_id = parseInt(data.harvester_silo_id);
  let harvester_id = parseInt(data.harvester_id);
  let silo_id = parseInt(data.silo_id);
  
  // First, check if the new association already exists (avoid duplicates)
  let checkQuery = `
    SELECT * FROM Harvesters_Spice_Silos 
    WHERE harvester_id = ? AND silo_id = ? AND harvester_silo_id != ?
  `;
  
  db.pool.query(checkQuery, [harvester_id, silo_id, association_id], function(error, checkResults) {
    if (error) {
      console.log("Database check error:", error);
      return res.status(400).json({ error: "Database check error" });
    }
    
    if (checkResults.length > 0) {
      return res.status(400).json({ error: "This harvester-silo association already exists" });
    }
    
    // Update the association
    let updateQuery = `
      UPDATE Harvesters_Spice_Silos 
      SET harvester_id = ?, silo_id = ? 
      WHERE harvester_silo_id = ?
    `;
    
    db.pool.query(updateQuery, [harvester_id, silo_id, association_id], function(error, updateResult) {
      if (error) {
        console.log("Database update error:", error);
        return res.status(400).json({ error: "Database update error" });
      }
      
      // Query to retrieve the updated association with details
      let selectQuery = `
        SELECT hs.harvester_silo_id, hs.harvester_id, hs.silo_id,
               h.model, h.base_city, s.city, s.spice_capacity
        FROM Harvesters_Spice_Silos hs
        JOIN Harvesters h ON hs.harvester_id = h.harvester_id
        JOIN Spice_Silos s ON hs.silo_id = s.silo_id
        WHERE hs.harvester_silo_id = ?
      `;
      
      db.pool.query(selectQuery, [association_id], function(error, rows) {
        if (error) {
          console.log("Error fetching updated association:", error);
          return res.status(400).json({ error: "Error fetching updated association" });
        }
        
        if (rows.length > 0) {
          let updatedAssociation = rows[0];
          
          // Create more readable description
          updatedAssociation.harvester_info = `${updatedAssociation.model} (${updatedAssociation.base_city})`;
          updatedAssociation.silo_info = `Silo ${updatedAssociation.silo_id} (${updatedAssociation.city}, Capacity: ${updatedAssociation.spice_capacity})`;
          
          console.log("Sending back updated association data:", updatedAssociation);
          return res.status(200).json(updatedAssociation);
        } else {
          return res.status(404).json({ error: "Association not found after update" });
        }
      });
    });
  });
});

// Route: DELETE /harvesters/delete-harvester-silo-ajax - Delete a harvester-silo association
router.delete('/delete-harvester-silo-ajax', function(req, res) {
  let data = req.body;
  
  // Debug logging
  console.log("Received DELETE request with data:", data);
  
  let association_id = parseInt(data.id);
  
  // Validate input
  if (!association_id) {
    console.log("Missing association ID");
    return res.status(400).json({ error: "Missing association ID" });
  }
  
  let deleteQuery = `DELETE FROM Harvesters_Spice_Silos WHERE harvester_silo_id = ?`;
  
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