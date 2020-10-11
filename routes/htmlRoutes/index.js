const path = require('path');
const router = require('express').Router();


// Add route to get index.html to be served from our Express.js server
// The '/' brings us to the root route of the server - used to create the homepage
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Add route to get animals.html page to be served from Express.js server
router.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

// Add route to get zookeepers.html page to be served from Express.js server
router.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

module.exports = router;