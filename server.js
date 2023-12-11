const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')

let errors  = {
  first_name: {isValid: false, text: ""},
  last_name:  {isValid: false, text: ""},
  username: {isValid: false, text: ""},
  email: {isValid: false, text: ""},
  password: {isValid: false, text: ""},
  confirmPassword: {isValid: false, text: ""},
  picture: {isValid: false, text: ""},
  birthdate: {isValid: true, text: "sono tornatooooo"},
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
  console.log(req.body);
  res.status(200)
  res.send("ok")
})

app.post("/username/check", (req, res)=>{
  if (req.body.username == "mpaterno")
    res.status(200);
  else
    res.status(404)
  res.send();
})
app.post("/email/check", (req, res)=>{
  console.log(req);
  if (req.body.email == "mpaterno@test.it")
    res.status(200);
  else
    res.status(404)
  res.send();
})

app.post("/register", (req, res)=>{
  console.log("hey")
  console.log(req.body);
  res.status(200)
  res.send(errors);
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});