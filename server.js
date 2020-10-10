// Access animal data from JSON file. Curly brackets = object destructuring. Only pulls from animals key value pair in JSON file. Not necessary in this case.
const { animals } = require('./:data/animals');

// Use Express.js npm package
const express = require('express');
const e = require('express');

// Tell app to use an environemnt variable (to work with Heroku)
const PORT = process.env.PORT || 3001;

// Instantiate (virtualize) the server
const app = express();

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

// Tell the server to listen for requests. Set up to work with Heroku.
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// Original port (before using Heroku)
// app.listen(3001, () => {
//     console.log(`API server now on port 3001!`);
// });