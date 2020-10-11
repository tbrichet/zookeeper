// Access animal data from JSON file. Curly brackets = object destructuring. Only pulls from animals key value pair in JSON file. Not necessary in this case.
const { animals } = require('./data/animals');

// Reference routes pages
const apiRoutes = require('./routes/apiRoutes/index.js');
const htmlRoutes = require('./routes/htmlRoutes/index.js');

// Use Express.js npm package
const express = require('express');
const e = require('express');

// Allow app to use fs and path
// Fs is needed for us to write new animal data to the animals.json file
const fs = require('fs');
// Path provides utilities for working with file and directory paths
const path = require('path');

// Tell app to use an environemnt variable (to work with Heroku)
const PORT = process.env.PORT || 3001;

// Instantiate (virtualize) the server
const app = express();

//Middleware functions

// Add middleware: Parse incoming string or array data from user
// Express.js executes this method- mounts a function to the server that the requests will pass through before getting to the intended endpoint
// Converts incoming POST data to key/value pairings that can be accessed in the req.body object
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
// Takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object
// Both of these middleware functions need to be set up every time you create a server that's looking to accept POST data
app.use(express.json());

//Middleware that allows us to use our routes pages
// When the client navigates to <ourhost>/api, the app will use the router we set up in apiRoutes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// Middleware that instructs the server to make files in public folder available
app.use(express.static('public'));

// Tell the server to listen for requests. Set up to work with Heroku.
// Typically the "listen" function goes at the bottom of the code
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// Original port (before using Heroku)
// app.listen(3001, () => {
//     console.log(`API server now on port 3001!`);
// });