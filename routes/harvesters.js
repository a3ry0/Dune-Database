const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

// Route: GET /harvesters - List all harvesters
router.get('/', function(req, res) {
  let query = "SELECT * FROM Harvesters;";
  db.pool.query(query, function(error, rows, fields) {
    if (error) {
      console.log(error);
      return res.sendStatus(500);
    } else {
      rows.forEach(row => {
        if (row.last_maintenance_date) {
          // Convert to YYYY-MM-DD format
          row.last_maintenance_date = row.last_maintenance_date.toISOString().split('T')[0];
        }
      });
      return res.render('harvesters', { data: rows });
    }
  });
});

// Route: POST /harvesters/add-harvester-ajax - Add a new harvester
router.post('/add-harvester-ajax', function(req, res) {
  let data = req.body;
  
  // Validate required fields
  if (!data.base_city || !data.model || !data.team_captain || !data.total_harvested) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  // Handle null maintenance date
  let maintenanceDate = data.last_maintenance_date ? data.last_maintenance_date : null;
  
  let query = `INSERT INTO Harvesters (base_city, model, team_captain, last_maintenance_date, total_harvested) 
               VALUES (?, ?, ?, ?, ?)`;
  
  db.pool.query(query, [data.base_city, data.model, data.team_captain, maintenanceDate, data.total_harvested], 
    function(error, results, fields) {
      if (error) {
        console.log("Database insert error:", error);
        return res.status(400).json({ error: "Database insert error" });
      } else {
        // Get the newly inserted ID
        const newId = results.insertId;
        console.log("New harvester inserted with ID:", newId);
        
        // Query to retrieve the newly inserted harvester
        let selectQuery = `SELECT * FROM Harvesters WHERE harvester_id = ?`;
        
        db.pool.query(selectQuery, [newId], function(error, rows, fields) {
          if (error) {
            console.log("Error fetching new harvester:", error);
            return res.status(400).json({ error: "Error fetching new harvester" });
          } else {
            if (rows.length > 0) {
              // Format date for JSON response
              let harvester = rows[0];
              if (harvester.last_maintenance_date) {
                harvester.last_maintenance_date = harvester.last_maintenance_date.toISOString().split('T')[0];
              }
              console.log("Sending back harvester data:", harvester);
              return res.status(200).json(harvester);
            } else {
              console.log("No harvester found with ID:", newId);
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
  
  // Validate required fields
  if (!data.harvester_id || !data.base_city || !data.model || !data.team_captain || !data.total_harvested) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  let harvesterId = parseInt(data.harvester_id);
  let maintenanceDate = data.last_maintenance_date ? data.last_maintenance_date : null;

  let queryUpdateHarvester = `UPDATE Harvesters 
                             SET base_city = ?, 
                                 model = ?, 
                                 team_captain = ?, 
                                 last_maintenance_date = ?, 
                                 total_harvested = ?
                             WHERE harvester_id = ?`;

  db.pool.query(queryUpdateHarvester, 
    [data.base_city, data.model, data.team_captain, maintenanceDate, data.total_harvested, harvesterId], 
    function(error, rows, fields){
      if (error) {
        console.log(error);
        return res.status(400).json({ error: "Update error" });
      } else {
        let querySelectUpdated = `SELECT * FROM Harvesters WHERE harvester_id = ?`;
        db.pool.query(querySelectUpdated, [harvesterId], function(error, updatedRows, fields){
          if (error) {
            console.log(error);
            return res.status(400).json({ error: "Error fetching updated harvester" });
          } else {
            if (updatedRows.length > 0) {
              // Format date for JSON response
              let harvester = updatedRows[0];
              if (harvester.last_maintenance_date) {
                harvester.last_maintenance_date = harvester.last_maintenance_date.toISOString().split('T')[0];
              }
              console.log("Sending back updated harvester data:", harvester);
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
router.delete('/delete-harvester-ajax', function(req, res, next){
  let data = req.body;
  
  if (!data.id) {
    return res.status(400).json({ error: "Missing harvester ID" });
  }
  
  let harvesterId = parseInt(data.id);
  let deleteHarvester = `DELETE FROM Harvesters WHERE harvester_id = ?`;
  
  db.pool.query(deleteHarvester, [harvesterId], function(error, rows, fields){
    if (error) {
      console.log(error);
      return res.status(400).json({ error: "Delete error" });
    } else {
      return res.sendStatus(204);
    }
  });
});

module.exports = router;