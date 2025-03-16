const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

// Route: GET /orders - List all orders
router.get('/', function(req, res) {
  // Query to get orders with customer names
  let query = `
    SELECT o.*, c.name AS customer_name
    FROM Orders o
    JOIN Customers c ON o.customer_id = c.customer_id
    ORDER BY o.order_id ASC;
  `;
  
  // Query to get all customers for dropdown
  let customersQuery = `SELECT customer_id, name FROM Customers ORDER BY name ASC;`;
  
  db.pool.query(query, function(error, orderRows, fields) {
    if (error) {
      console.log("Error fetching orders:", error);
      return res.sendStatus(500);
    }
    
    // Get customers for dropdown
    db.pool.query(customersQuery, function(error, customerRows, fields) {
      if (error) {
        console.log("Error fetching customers:", error);
        return res.sendStatus(500);
      }
      
      // Format order dates
      orderRows.forEach(row => {
        if (row.order_date) {
          row.order_date = new Date(row.order_date).toISOString().split('T')[0];
        }
      });
      
      res.render('orders', { 
        orders: orderRows,
        customers: customerRows
      });
    });
  });
});

// Route: POST /orders/add-order-ajax - Add a new order
router.post('/add-order-ajax', function(req, res) {
  let data = req.body;
  
  // Debug logging
  console.log("Received POST request with data:", data);
  
  // Validate input data
  if (!data.customer_id || !data.order_date || !data.total_quantity || !data.order_status || !data.destination) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  let query1 = `INSERT INTO Orders (customer_id, order_date, total_quantity, order_status, destination) 
                VALUES (?, ?, ?, ?, ?)`;

  // Debug logging
  console.log("Inserting with values:", [data.customer_id, data.order_date, data.total_quantity, data.order_status, data.destination]);

  db.pool.query(query1, [data.customer_id, data.order_date, data.total_quantity, data.order_status, data.destination], function(error, results, fields) {
    if (error) {
      console.log("Database insert error:", error);
      return res.status(400).json({ error: "Database insert error" });
    } else {
      // Get the newly inserted ID
      const newId = results.insertId;
      console.log("New order inserted with ID:", newId);
      
      // Query to retrieve the newly inserted order with customer name
      let query2 = `
        SELECT o.*, c.name AS customer_name
        FROM Orders o
        JOIN Customers c ON o.customer_id = c.customer_id
        WHERE o.order_id = ?
      `;
      
      db.pool.query(query2, [newId], function(error, rows, fields) {
        if (error) {
          console.log("Error fetching new order:", error);
          return res.status(400).json({ error: "Error fetching new order" });
        } else {
          if (rows.length > 0) {
            console.log("Sending back order data:", rows[0]);
            return res.status(200).json(rows[0]);
          } else {
            console.log("No order found with ID:", newId);
            return res.status(404).json({ error: "Order not found after insert" });
          }
        }
      });
    }
  });
});

// Route: PUT /orders/put-order-ajax - Update an order
router.put('/put-order-ajax', function(req, res, next){
  let data = req.body;
  
  // Debug logging
  console.log("Received PUT request with data:", data);
  
  let order_id = parseInt(data.order_id);
  let customer_id = data.customer_id;
  let order_date = data.order_date;
  let total_quantity = data.total_quantity;
  let order_status = data.order_status;
  let destination = data.destination;

  // Validate input data
  if (!order_id || !customer_id || !order_date || !total_quantity || !order_status || !destination) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  let queryUpdateOrder = `
    UPDATE Orders 
    SET customer_id = ?, order_date = ?, total_quantity = ?, order_status = ?, destination = ? 
    WHERE order_id = ?
  `;
  
  // Debug logging
  console.log("Updating with values:", [customer_id, order_date, total_quantity, order_status, destination, order_id]);

  db.pool.query(queryUpdateOrder, [customer_id, order_date, total_quantity, order_status, destination, order_id], function(error, result, fields){
    if (error) {
      console.log("Update error:", error);
      return res.status(400).json({ error: "Database update error" });
    } else {
      // Query to retrieve the updated order with customer name
      let querySelectUpdated = `
        SELECT o.*, c.name AS customer_name
        FROM Orders o
        JOIN Customers c ON o.customer_id = c.customer_id
        WHERE o.order_id = ?
      `;
      
      db.pool.query(querySelectUpdated, [order_id], function(error, updatedRows, fields){
        if (error) {
          console.log("Error fetching updated order:", error);
          return res.status(400).json({ error: "Error fetching updated order" });
        } else {
          if (updatedRows.length > 0) {
            let updatedOrder = updatedRows[0];
            console.log("Sending back updated order data:", updatedOrder);
            return res.status(200).json(updatedOrder);
          } else {
            console.log("No order found with ID after update:", order_id);
            return res.status(404).json({ error: "Order not found after update" });
          }
        }
      });
    }
  });
});

// Route: DELETE /orders/delete-order-ajax - Delete an order
router.delete('/delete-order-ajax', function(req, res, next){
  let data = req.body;
  
  // Debug logging
  console.log("Received DELETE request with data:", data);
  
  let order_id = parseInt(data.id);
  
  // Validate input
  if (!order_id) {
    console.log("Missing order ID");
    return res.status(400).json({ error: "Missing order ID" });
  }
  
  let deleteOrder = `DELETE FROM Orders WHERE order_id = ?`;
  
  // Debug logging
  console.log("Deleting order with ID:", order_id);
  
  db.pool.query(deleteOrder, [order_id], function(error, result, fields){
    if (error) {
      console.log("Delete error:", error);
      return res.status(400).json({ error: "Database delete error" });
    } else {
      console.log("Order deleted successfully");
      return res.sendStatus(204);
    }
  });
});

module.exports = router;