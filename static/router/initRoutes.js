import Login from "/views/Login.js"
import Signup from "/views/Signup.js"
import Home from "/views/Home.js"
import Games from "/views/Games.js"
import Pong3d from "/views/Pong3d.js"
import Pong2d from "/views/Pong2d.js"
import UserInfo from "/views/UserInfo.js"
import PasswordRecovery from "/views/PasswordRecovery.js"

const   Routes = [
    { path: "/", view: Home, style: "/style/home.css", modernStyle: "/style/modern/home.css"},
    { path: "/login", view: Login, style: "/style/login.css", modernStyle: "/style/modern/login.css"},
    { path: "/signup", view: Signup, style: "/style/signup.css", modernStyle: "/style/modern/signup.css"},
    { path: "/games", view: Games, style: "/style/games.css", modernStyle: "/style/modern/games.css"},
    { path: "/games/pongThreeD", view: Pong3d, style: "/style/pong3d.css", modernStyle: "/style/modern/pong3d.css"},
    { path: "/games/pongTwoD", view: Pong2d, style: "/style/pong2d.css", modernStyle: "/style/modern/pong2d.css"},
    { path: "/userInfo", view: UserInfo, style: "/style/userInfo.css", modernStyle: "/style/modern/userInfo.css"}, 
    { path: "/password/recovery/", view: PasswordRecovery, style: "/style/passwordRecovery.css", modernStyle: "/style/modern/userInfo.css"}
]

export default Routes;