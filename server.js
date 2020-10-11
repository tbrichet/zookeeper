// Access animal data from JSON file. Curly brackets = object destructuring. Only pulls from animals key value pair in JSON file. Not necessary in this case.
const { animals } = require('./:data/animals');

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


// Filter data by query. Function will need 2 things to run: query and an animals array
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
          personalityTraitsArray = [query.personalityTraits];
          console.log("This is a string");
        } else {
          personalityTraitsArray = query.personalityTraits;
          console.log("This is not a string");
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
          // Check the trait against each animal in the filteredResults array.
          // Remember, it is initially a copy of the animalsArray,
          // but here we're updating it for each trait in the .forEach() loop.
          // For each trait being targeted by the filter, the filteredResults
          // array will then contain only the entries that contain the trait,
          // so at the end we'll have an array of animals that have every one 
          // of the traits when the .forEach() loop is finished.

          // Filtering by trait and pushing animals with that trait into the FilteredResults array (updating FilteredResults array)
          filteredResults = filteredResults.filter(
              //Name every element in the filtered results "animal" and checking the index of the trait
              // If we check the index of the animal/trait and it exists in the array (!== -1) then it will update it
            animal => animal.personalityTraits.indexOf(trait) !== -1
          );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // Returns updated array
    return filteredResults;
}

// Function to take in the id and array of animals and return a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id ===id)[0];
    return result;
}

// Function that allows user to create new animal
// Function accepts the POST route's req.body value and the array we want to add the data to
function createNewAnimal (body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    // Add new created animal to JSON file
    fs.writeFileSync(
        path.join(__dirname, './:data/animals.json'),
        // We need to save the JavaScript array data as JSON, so JSON.stringify converts it
        // Null argument means we don't want to edit any of our existing data
        // The 2 indicates we want to create white space between our values to make it more readable
        JSON.stringify({animals: animalsArray}, null, 2)
    );
    return animal;
}

// Validate data when user enters new animal
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  };

// Add the route that the front end can request data from
app.get('/api/animals', (req,res) => {
    // Create new variable to create a "copy" of the animal data that can change based on our search
    let results = animals;
    console.log(req)
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// Define specific search parameter when searching for one specific animal (instead of array of animals that all match a query)
// Param routes MUST come after the other get route
// Only returns one specific animal since searching by animal ID
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result)
    } else {
        // Client receives 404 error if no record exists for searched animal
        res.send(404);
    }
});

// Create route that allows users to enter new animal data
// POST requests represent the action of a client requesting the server to accept data (rather than request data)
app.post('/api/animals', (req, res) => {
    // Set animal id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in the req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        req.status(400).send('The animal is not properly formatted');
        
    } else {

    // Add animal to json file and animals array in this function
    // Call function that creates new animal
    const animal = createNewAnimal(req.body, animals);

    // With POST requests we can package data (typically as an object) and send it to the server
    // req.body is where we can access the data on the server side and do something with it
    // req.body is where our incoming content will be (this is an Express method)
    //console.log(req.body);
    //res.json(animal);
    res.json(animal);
    }
});


// Tell the server to listen for requests. Set up to work with Heroku.
// Typically the "listen" function goes at the bottom of the code
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// Original port (before using Heroku)
// app.listen(3001, () => {
//     console.log(`API server now on port 3001!`);
// });