const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')

let errors  = {
  username: "hahaha",
  user_info: {
    first_name: "boh"
  }
}

function generateAccessToken(username) {
  return jwt.sign({username}, "secret", { expiresIn: '30m' });
}

const app = express();

app.use(express.static("./static"))
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const PORT = process.env.PORT || 4200;

app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "./index.html"))
})

app.post("/login", (req, res)=>{
  console.log("hey")
  console.log(req.body.username);
  console.log(generateAccessToken(req.body.username))
  res.cookie('jwt', generateAccessToken("test"), {
    // Options for the cookie
    httpOnly: true,
    maxAge: 3600000, // Expires in 1 hour (in milliseconds)
    // Other options like secure, domain, path, etc. can be set here
  });
  res.json({"jwt": generateAccessToken(req.body.username)})
  res.status(200)
  res.send();
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});