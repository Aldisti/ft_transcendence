import Login from "/views/Login.js"
import Signup from "/views/Signup.js"
import Home from "/views/Home.js"

const   Routes = [
    { path: "/", view: Home, style: "/style/home.css"},
    { path: "/login", view: Login, style: "/style/login.css"},
    { path: "/signup", view: Signup, style: "/style/signup.css"},
]

export default Routes;