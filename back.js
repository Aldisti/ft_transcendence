const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')
const cors = require('cors');

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}));


// parse application/json
app.use(bodyParser.json())
const PORT = process.env.PORT || 8000;
app.post("/auth/refresh/", (req, res) => {
    console.log(req.headers);
    res.status(200).send();
})
app.post("/login", (req, res) => {
    console.log("hey")
    console.log(req.body.username);
    console.log(generateAccessToken(req.body.username))
    res.cookie('jwt', generateAccessToken("test"), {
        // Options for the cookie
        httpOnly: true,
        maxAge: 3600000, // Expires in 1 hour (in milliseconds)
        // Other options like secure, domain, path, etc. can be set here
    });
    res.json({ "jwt": generateAccessToken(req.body.username) })
    res.status(200)
    res.send();
})


app.post("/username/check", (req, res) => {
    if (req.body.username == "mpaterno")
        res.status(200);
    else
        res.status(404)
    res.send();
})
app.post("/email/check", (req, res) => {
    console.log(req);
    if (req.body.email == "mpaterno@test.it")
        res.status(200);
    else
        res.status(404)
    res.send();
})

app.post("/auth/login/", (req, res) => {
    console.log(req.body)
    res.json({ access_token: "ciaooo" }).status(200).send()
})
app.get("/auth/logout/", (req, res) => {

    res.status(200).send()
})

app.get('/test/logout', (req, res) => {
    console.log("ho fatto logout");
    res.status(200);
    res.send("ok")
})

app.get("/users", (req, res) => {
    console.log("test")
    res.status(200)
    res.json({ test: "test" });
    res.send();
})

app.post("/register", (req, res) => {
    console.log("hey")
    console.log(req.body);
    res.status(200)
    res.send(errors);
})

app.post("/password", (req, res) => {
    console.log("hey")
    console.log(req.body);
    res.status(400)
    res.send("hey");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});