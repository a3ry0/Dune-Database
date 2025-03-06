/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 8877;                 // Set a port number at the top so it's easy to change in the future
// Database
var db = require('./database/db-connector')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// app.js

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    LISTENER
*/

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});


/*
    ROUTES
*/

app.get('/', function(req, res)
    {  
        let query1 = "SELECT * FROM Customers;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

app.get('/customers', function(req, res) {
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

app.post('/add-customer-ajax', function(req, res) {
    let data = req.body;

    let query1 = `INSERT INTO Customers (name, planet, affiliation) VALUES (?, ?, ?)`;
    let affiliationValue = data.affiliation ? data.affiliation : null;

    db.pool.query(query1, [data.name, data.planet, affiliationValue], function(error, results, fields) {
        if (error) {
            console.log("Database insert error:", error);
            res.sendStatus(400);
        } else {
            // Fetch the newly inserted customer using LAST_INSERT_ID()
            let query2 = `SELECT * FROM Customers WHERE customer_id = LAST_INSERT_ID();`;
            db.pool.query(query2, function(error, rows, fields) {
                if (error) {
                    console.log("Error fetching new customer:", error);
                    res.sendStatus(400);
                } else {
                    res.json(rows[0]); // Send the newly inserted customer as JSON
                }
            });
        }
    });
});

app.put('/put-customer-ajax', function(req, res, next){
    let data = req.body;

    let customer = parseInt(data.customer_id);
    let planet = data.planet;
    let affiliation = data.affiliation;

    let queryUpdateCustomer = `UPDATE Customers SET planet = ?, affiliation = ? WHERE customer_id = ?`;

    db.pool.query(queryUpdateCustomer, [planet, affiliation, customer], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Fetch the updated customer record and send it back
            let querySelectUpdated = `SELECT * FROM Customers WHERE customer_id = ?`;
            db.pool.query(querySelectUpdated, [customer], function(error, updatedRows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.json(updatedRows[0]); // Send updated customer data back to the frontend
                }
            });
        }
    });
});

app.delete('/delete-customer-ajax', function(req,res, next){
    let data = req.body;
    let customer_id = parseInt(data.id);
    let deleteCustomer= `DELETE FROM Customers WHERE customer_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteCustomer, [customer_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })});

  app.get('/orders', function(req, res) {
    res.render('orders');
});

app.get('/shipments', function(req, res) {
    res.render('shipments');
});

app.get('/spice_silos', function(req, res) {
    res.render('spice_silos');
});

app.get('/harvesters', function(req, res) {
    res.render('harvesters');
});