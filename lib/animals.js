// Allow app to use fs and path
// Fs is needed for us to write new animal data to the animals.json file
const fs = require('fs');
// Path provides utilities for working with file and directory paths
const path = require('path');

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
};

// Function to take in the id and array of animals and return a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id ===id)[0];
    return result;
};

// Function that allows user to create new animal
// Function accepts the POST route's req.body value and the array we want to add the data to
function createNewAnimal (body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    // Add new created animal to JSON file
    fs.writeFileSync(
        path.join(__dirname, '../data/animals.json'),
        // We need to save the JavaScript array data as JSON, so JSON.stringify converts it
        // Null argument means we don't want to edit any of our existing data
        // The 2 indicates we want to create white space between our values to make it more readable
        JSON.stringify({animals: animalsArray}, null, 2)
    );
    return animal;
};

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

  // Export functions from this file
  module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
  };