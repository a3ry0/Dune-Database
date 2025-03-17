const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

// Route: GET /Spice_Silos - List all silos
router.get('/', function(req, res) {
  let query = "SELECT * FROM Spice_Silos;";
  db.pool.query(query, function(error, rows, fields) {
    if (error) {
      console.log(error);
      return res.sendStatus(500);
    } else {
      rows.forEach(row => {
        if (row.last_inspection_date) {
          // Convert to YYYY-MM-DD format
          row.last_inspection_date = row.last_inspection_date.toISOString().split('T')[0];
        }
      });
      return res.render('spice_silos', { data: rows });
    }
  });
});

// Route: POST /spice-silos/add-spice-silo-ajax - Add a new silo
router.post('/add-spice-silo-form-ajax', function(req, res) {
  let data = req.body;
  
  // Validate input data
  if (!data.city || !data.spice_capacity || !data.spice_quantity ) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  let last_inspection_date = data.last_inspection_date ? data.last_inspection_date : null;

  
  let query1 = `INSERT INTO Spice_Silos (city, spice_capacity, spice_quantity, last_inspection_date) VALUES (?, ?, ?, ?)`;

  db.pool.query(query1, [data.city, data.spice_capacity, data.spice_quantity, last_inspection_date], function(error, results, fields) {
    if (error) {
      console.log("Database insert error:", error);
      return res.status(400).json({ error: "Database insert error" });
    } else {
      // Get the newly inserted ID
      const newId = results.insertId;
      console.log("New silo inserted with ID:", newId);
      
      // Query to retrieve the newly inserted silo
      let query2 = `SELECT * FROM Spice_Silos WHERE silo_id = ?`;
      
      db.pool.query(query2, [newId], function(error, rows, fields) {
        if (error) {
          console.log("Error fetching new silo:", error);
          return res.status(400).json({ error: "Error fetching new silo" });
        } else {
          if (rows.length > 0) {
            console.log("Sending back silo data:", rows[0]);
            return res.status(200).json(rows[0]);
          } else {
            console.log("No silo found with ID:", newId);
            return res.status(404).json({ error: "silo not found after insert" });
          }
        }
      });
    }
  });
});

// Route: PUT /silos/put-spice-silo-ajax - Update a silo
router.put('/put-spice-silo-ajax', function(req, res, next){
  let data = req.body;
  let silo_id = parseInt(data.silo_id);
  let city = data.city;
  let spice_capacity = parseInt(data.spice_capacity);
  let spice_quantity = parseInt(data.spice_quantity);
  let last_inspection_date = data.last_inspection_date ? data.last_inspection_date : null;

  console.log(city, spice_capacity, spice_quantity, last_inspection_date, silo_id)

  let queryUpdateSilo = `UPDATE Spice_Silos SET city = ?, spice_capacity = ?, spice_quantity = ?, last_inspection_date = ? WHERE silo_id = ?`;

  // Validate input data
  if (!silo_id || !data.city || !data.spice_capacity || !data.spice_quantity ) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }


  db.pool.query(queryUpdateSilo, [city, spice_capacity, spice_quantity, last_inspection_date, silo_id], function(error, rows, fields){
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      let querySelectUpdated = `SELECT * FROM Spice_Silos WHERE silo_id = ?`;
      db.pool.query(querySelectUpdated, [silo_id], function(error, updatedRows, fields){
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          if (updatedRows.length > 0) {
            // Format date for JSON response
            let updatedSilo = updatedRows[0];
            console.log("Sending back updated silo data:", updatedSilo);
            return res.status(200).json(updatedSilo);
          } else {
            return res.status(404).json({ error: "Silo not found after update" });
          }
        }
      });
    }
  });
});

// Route: DELETE /spice-silos/delete-spice-silo-ajax - Delete a silo
router.delete('/delete-spice-silo-ajax', function(req,res, next){
  let data = req.body;
  let silo_id = parseInt(data.id);
  let deleteSpiceSilo= `DELETE FROM Spice_Silos WHERE silo_id = ?`;
  
  db.pool.query(deleteSpiceSilo, [silo_id], function(error, rows, fields){
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = router;