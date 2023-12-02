const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')

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

app.post("/register", (req, res)=>{
  console.log("hey")
  console.log(req.body);
  res.status(200)
  res.send("ok")
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});