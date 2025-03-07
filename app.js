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

// Import customer routes
const customerRoutes = require('./routes/customers');
const harvesterRoutes = require('./routes/harvesters')


// Mount customer routes at '/customers'
app.use('/customers', customerRoutes);
app.use('/harvesters', harvesterRoutes)


/*
    LISTENER
*/

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});


/*
    ROUTES
*/
app.get('/', function(req, res) {
    res.render('index');
});

  app.get('/orders', function(req, res) {
    res.render('orders');
});

app.get('/shipments', function(req, res) {
    res.render('shipments');
});

app.get('/spice_silos', function(req, res) {
    res.render('spice_silos');
});