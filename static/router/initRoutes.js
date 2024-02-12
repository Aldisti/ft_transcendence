import Login from "/views/Login.js"
import Signup from "/views/Signup.js"
import Home from "/views/Home.js"
import Games from "/views/Games.js"
import Pong3d from "/views/Pong3d.js"
import Pong2d from "/views/Pong2d.js"
import Pong2dTournaments from "/views/Pong2dTournament.js"
import UserInfo from "/views/UserInfo.js"
import PasswordRecovery from "/views/PasswordRecovery.js"
import UserDisplay from "/views/DisplayUser.js"
import Admin from "/views/Admin.js"
import Notification from "/views/Notification.js"
import NotFound from "/views/NotFound.js"
import MatchHistory from "/views/MatchHistory.js"
import CallBack from "/views/Oauth2.js"

const   Routes = [
    { path: "/error/", view: NotFound, style: "/style/notFound.css", modernStyle: "/style/modern/notFound.css"},
    { path: "/", view: Home, style: "/style/home.css", modernStyle: "/style/modern/home.css"},
    { path: "/login/", view: Login, style: "/style/login.css", modernStyle: "/style/modern/login.css"},
    { path: "/register/", view: Signup, style: "/style/signup.css", modernStyle: "/style/modern/signup.css"},
    { path: "/games/", view: Games, style: "/style/games.css", modernStyle: "/style/modern/games.css"},
    { path: "/games/pongThreeD/", view: Pong3d, style: "/style/pong3d.css", modernStyle: "/style/modern/pong3d.css"},
    { path: "/games/pong2d/", view: Pong2d, style: "/style/pong2d.css", modernStyle: "/style/modern/pong2d.css"},
    { path: "/games/pong2d/tournaments/", view: Pong2dTournaments, style: "/style/pong2dTournament.css", modernStyle: "/style/modern/pong2dTournament.css"},
    { path: "/account/", view: UserInfo, style: "/style/userInfo.css", modernStyle: "/style/modern/userInfo.css"}, 
    { path: "/password/reset/", view: PasswordRecovery, style: "/style/passwordRecovery.css", modernStyle: "/style/modern/passwordRecovery.css"},
    { path: "/google/callback", view: CallBack, style: "/style/userInfo.css", modernStyle: "/style/modern/userInfo.css"},
    { path: "/intra/callback/", view: CallBack, style: "/style/userInfo.css", modernStyle: "/style/modern/userInfo.css"},
    { path: "/user/", view: UserDisplay, style: "/style/displayUser.css", modernStyle: "/style/modern/displayUser.css"},
    { path: "/admin/", view: Admin, style: "/style/admin.css", modernStyle: "/style/modern/admin.css"},
    { path: "/notification/", view: Notification, style: "/style/notification.css", modernStyle: "/style/modern/notification.css"},
    { path: "/match-history/", view: MatchHistory, style: "/style/matchHistory.css", modernStyle: "/style/modern/matchHistory.css"},

]

export default Routes;