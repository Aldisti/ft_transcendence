// Import required modules
const express = require('express');
const cors = require('cors');

// Create an Express application
const app = express();
const port = 3000; // You can change this port as needed
app.use(cors("*"));

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


const tournaments = [
    {
      title: "First Tournament",
      description: "Eccoci pronti per il torneo di Pong, il gioco che ha dato il via alla storia dei videogiochi! Unisciti a noi per un'epica sfida all'ultimo pixel.",
      time: "17:42",
      participants: 0,
      total: 100,
      registered: false
    },
    {
      title: "Second Tournament",
      description: "Affina i tuoi riflessi, pianifica le tue mosse e preparati a colpire con precisione millimetrica. Sfida i tuoi amici o dimostra la tua superiorità contro avversari nuovi di zecca.",
      time: "17:42",
      participants: 90,
      total: 100,
      registered: false
    },
    {
      title: "Third Tournament",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: "17:42",
      participants: 10,
      total: 12,
      registered: true
    },
    {
      title: "Fourth Tournament",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: "17:42",
      participants: 60,
      total: 100,
      registered: true
    }
  ];
  
  app.get('/tournaments', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.json(tournaments);
  });
  app.patch('/submit', (req, res) => {
    res.status(200).send();
  });
  app.patch('/create', (req, res) => {
    res.status(200).send();
  });
  app.delete('/unsubscribe', (req, res) => {
    res.status(200).send();
  });

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});