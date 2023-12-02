import Login from "/views/Login.js"
import Signup from "/views/Signup.js"
import Home from "/views/Home.js"
import Games from "/views/Games.js"

const   Routes = [
    { path: "/", view: Home, style: "/style/home.css", modernStyle: "/style/modern/home.css"},
    { path: "/login", view: Login, style: "/style/login.css", modernStyle: "/style/modern/login.css"},
    { path: "/signup", view: Signup, style: "/style/signup.css", modernStyle: "/style/modern/signup.css"},
    { path: "/games", view: Games, style: "/style/games.css", modernStyle: "/style/modern/games.css"},
]

export default Routes;