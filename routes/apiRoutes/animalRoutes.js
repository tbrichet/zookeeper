// Start an instance of Router
// Router replaces the app functions which allows you to declare routes in any file (with proper)
const router = require('express').Router();

// Import Functions
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');


// Add the route that the front end can request data from
//app.get('/animals', (req,res) => {
router.get('/animals', (req, res) => {
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
//app.get('/animals/:id', (req, res) => {
router.get('/animals/:id', (req, res) => {
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
//app.post('/animals', (req, res) => {
router.post('/animals', (req, res) => {
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

// Export router
module.exports  = router;  