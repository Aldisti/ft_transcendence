const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cors = require('cors');
var bodyParser = require('body-parser')

let errors = {
    username: "hahaha",
    user_info: {
        first_name: "boh"
    }
}

function generateAccessToken(username) {
    return jwt.sign({ username }, "secret", { expiresIn: '30m' });
}

const app = express();

app.use(express.static("./static"))
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors({
    origin: 'http://localhost:8000', // Replace with your frontend URL
    credentials: true, // This will allow credentials like cookies
  }));
const PORT = process.env.PORT || 4200;

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"))
})


app.listen(PORT, () => {
    //console.log(`Server is running on port ${PORT}`);
});