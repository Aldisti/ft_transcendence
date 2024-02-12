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

let tournament = [
  [{username: "mpaterno", winner: true, picture: "https://i.pinimg.com/originals/56/a6/14/56a614261d423da1825452363174c685.gif"}, {username: "test", winner: true, picture: "https://media2.giphy.com/media/H4DjXQXamtTiIuCcRU/200.gif?cid=6c09b9520bj6m7xg37ahumbcjupubsev9bzty3v6gozbpv2i&ep=v1_gifs_search&rid=200.gif&ct=g"}, {username: "gpanico", winner: false, picture: "https://i.gifer.com/origin/d6/d66620ccdb4aee4182879a2c07d393ef_w200.gif"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}],
  [{username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}],
  // [{username: "mpaterno", winner: true, picture: "https://i.pinimg.com/originals/56/a6/14/56a614261d423da1825452363174c685.gif"}, {username: "test", winner: true, picture: "https://media2.giphy.com/media/H4DjXQXamtTiIuCcRU/200.gif?cid=6c09b9520bj6m7xg37ahumbcjupubsev9bzty3v6gozbpv2i&ep=v1_gifs_search&rid=200.gif&ct=g"}, {username: "gpanico", winner: false, picture: "https://i.gifer.com/origin/d6/d66620ccdb4aee4182879a2c07d393ef_w200.gif"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}],
  [{username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}],
  [{username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}],
  [{username: "winner", winner: true, picture: "https://cdn.shopify.com/s/files/1/0344/6469/files/cat-gif-loop-wheel_grande.gif?v=1523982721"}],
]

let matches = [{
  opponent: "gpanico",
  id: "test",
  rank: ["user1", "user2", "user3", "user4", "user5"],
  scores: [4, 11]

},{
  opponent: "gpanico",
  rank: ["user1", "user2", "user3", "user4", "user5"],
  scores: [11, 9]

},{
  opponent: "gpanico",
  id:"test",
  rank: ["user1", "user2", "user3", "user4", "user5"],
  scores: [11, 3]
},{
  opponent: "gpanico",
  id:"test",
  rank: ["user1", "user2", "user3", "user4", "user5"],
  scores: [4, 11]
},{
  opponent: "gpanico",
  id:"test",
  rank: ["user1", "user2", "user3", "user4", "user5"],
  scores: [4, 11]
},]

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
  app.get('/tournament-info/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.json(tournament);
  });
  app.get('/match-history/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.json(matches);
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