// Import required modules
const express = require('express');
const cors = require('cors');

// Create an Express application
const app = express();
const port = 3000; // You can change this port as needed
app.use(cors());

let counter = 6

// Define your list of objects
const listOfObjects ={results: [
    { username: "test", user_info: {picture: null} },
    { username: "test1", user_info: {picture: null} },
    { username: "test2", user_info: {picture: null} },
    { username: "test3", user_info: {picture: null} },
    { username: "test4", user_info: {picture: null} },
    { username: "test5", user_info: {picture: null} },
    { username: "test7", user_info: {picture: null} },
]};

// Define a route that returns the list of objects
app.get('/objects', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (counter-- >= 0)
        res.json(listOfObjects);
    else    
        res.json({});
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});