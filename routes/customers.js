const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

// Route: GET /customers - List all customers
router.get('/', function(req, res) {
  let query1 = "SELECT * FROM Customers;";
  db.pool.query(query1, function(error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {
      res.render('customers', { data: rows });
    }
  });
});

// Route: POST /customers/add-customer-ajax - Add a new customer
router.post('/add-customer-ajax', function(req, res) {
  let data = req.body;
  
  // Validate input data
  if (!data.name || !data.planet) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  let query1 = `INSERT INTO Customers (name, planet, affiliation) VALUES (?, ?, ?)`;
  let affiliationValue = data.affiliation ? data.affiliation : null;

  db.pool.query(query1, [data.name, data.planet, affiliationValue], function(error, results, fields) {
    if (error) {
      console.log("Database insert error:", error);
      return res.status(400).json({ error: "Database insert error" });
    } else {
      // Get the newly inserted ID
      const newId = results.insertId;
      console.log("New customer inserted with ID:", newId);
      
      // Query to retrieve the newly inserted customer
      let query2 = `SELECT * FROM Customers WHERE customer_id = ?`;
      
      db.pool.query(query2, [newId], function(error, rows, fields) {
        if (error) {
          console.log("Error fetching new customer:", error);
          return res.status(400).json({ error: "Error fetching new customer" });
        } else {
          if (rows.length > 0) {
            console.log("Sending back customer data:", rows[0]);
            return res.status(200).json(rows[0]);
          } else {
            console.log("No customer found with ID:", newId);
            return res.status(404).json({ error: "Customer not found after insert" });
          }
        }
      });
    }
  });
});

// Route: PUT /customers/put-customer-ajax - Update a customer
router.put('/put-customer-ajax', function(req, res, next){
  let data = req.body;
  let customer = parseInt(data.customer_id);
  let name = data.name;
  let planet = data.planet;
  let affiliation = data.affiliation;

  let queryUpdateCustomer = `UPDATE Customers SET name = ?, planet = ?, affiliation = ? WHERE customer_id = ?`;

  db.pool.query(queryUpdateCustomer, [name, planet, affiliation, customer], function(error, rows, fields){
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      let querySelectUpdated = `SELECT * FROM Customers WHERE customer_id = ?`;
      db.pool.query(querySelectUpdated, [customer], function(error, updatedRows, fields){
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          if (updatedRows.length > 0) {
            // Format date for JSON response
            let harvester = updatedRows[0];
            console.log("Sending back updated harvester data:", harvester);
            return res.status(200).json(harvester);
          } else {
            return res.status(404).json({ error: "Customer not found after update" });
          }
        }
      });
    }
  });
});

// Route: DELETE /customers/delete-customer-ajax - Delete a customer
router.delete('/delete-customer-ajax', function(req,res, next){
  let data = req.body;
  let customer_id = parseInt(data.id);
  let deleteCustomer= `DELETE FROM Customers WHERE customer_id = ?`;
  
  db.pool.query(deleteCustomer, [customer_id], function(error, rows, fields){
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = router;