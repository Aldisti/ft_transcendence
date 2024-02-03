import Aview from "/views/abstractView.js";
import Router from "/router/mainRouterFunc.js"
import setupBtnClickHandler from "/viewScripts/admin/clickHandler.js"
import * as API from "/API/APICall.js"
import * as HANDLERS from "/viewScripts/admin/scrollHandlers.js"


export default class extends Aview{
    constructor(){
        super();
    }

    createUser(userData){
        if (userData.username == localStorage.getItem("username"))
            return ''
        return `
        <div class="adminUserLine">
            <div class="upperLine">
                <div class="username">
                    <h3>${userData.username}</h3>
                </div>
                <div class="photo">
                    <img src="${userData.picture == null ? "/imgs/defaultImg.jpg" : userData.picture}">
                </div>
            </div>
            <div class="bottomLine">
                <button username=${userData.username} class="ban">
                    Ban User
                </button>
                <button username=${userData.username} class="makeModerator">
                    Make Moderator
                </button>
                <button username=${userData.username} class="delete">
                    Delete User
                </button>
            </div>
        </div>
        `
    }   
    createModerator(userData){
        return `
        <div class="adminUserLine">
            <div class="upperLine">
                <div class="username">
                    <h3>${userData.username}</h3>
                </div>
                <div class="photo">
                    <img src="${userData.picture == null ? "/imgs/defaultImg.jpg" : userData.picture}">
                </div>
            </div>
            <div class="bottomLine">
                <button username=${userData.username} class="ban">
                    Ban User
                </button>
                <button username=${userData.username} class="removeModerator">
                    Remove Moderator
                </button>
                <button username=${userData.username} class="delete">
                    Delete User
                </button>
            </div>
        </div>
        `
    }   
    createBannedUser(userData){
        return `
        <div class="adminUserLine">
            <div class="upperLine">
                <div class="username">
                    <h3>${userData.username}</h3>
                </div>
                <div class="photo">
                    <img src="${userData.picture == null ? "/imgs/defaultImg.jpg" : userData.picture}">
                </div>
            </div>
            <div class="bottomLine">
                <button username=${userData.username} class="undoBan">
                    Undo Ban
                </button>
                <button username=${userData.username} class="delete">
                    Delete User
                </button>
            </div>
        </div>
        `
    }   

    getHtml(){
        let role = JSON.parse(window.decode64(localStorage.getItem("jwt"))).role;

        return `
            <div class="base">
                <div class="manageUsers">
                    <div class="sectionTitle">
                        <h1>Manage Users</h1>
                        <div class="searchComponent">
                            <input type="text"><button class="adminSearchUser">search</button><button class="restore">X</button>
                        </div>
                    </div>
                    <div containerNumber=0 class="usersContainer">
                
                    </div>
                </div>
                <div class="manageUsers">
                    <div class="sectionTitle">
                        <h1>Manage Moderator</h1>
                        <div class="searchComponent">
                            <input type="text"><button class="adminSearchUser">search</button><button class="restore">X</button>
                        </div>
                    </div>
                    <div containerNumber=1 class="usersContainer">
                
                    </div>
                </div>           
                <div class="manageUsers">
                    <div class="sectionTitle">
                        <h1>Manage Banned Users</h1>
                        <div class="searchComponent">
                            <input type="text"><button class="adminSearchUser">search</button><button class="restore">X</button>
                        </div>
                    </div>
                    <div containerNumber=2 class="usersContainer">
                
                    </div>
                </div>
            </div>
        `
    }

    setup(){
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpeg")
        let role = JSON.parse(window.decode64(localStorage.getItem("jwt"))).role;

        console.log(role)
        if (role != "A" && role != "M")
        {
            history.pushState(null, null, "/home/");
            Router();
        }
        else if (role == "M"){
            document.querySelectorAll(".manageUsers")[1].style.display = "none"
        }

        let manageUser = document.querySelectorAll(".usersContainer")[0];
        manageUser.addEventListener("scroll", HANDLERS.handleUsersScroll.bind(null, this, manageUser));
        document.querySelectorAll(".manageUsers")[0].querySelector(".adminSearchUser").addEventListener("click", HANDLERS.handleUserSearch.bind(null, this, manageUser));
        document.querySelectorAll(".manageUsers")[0].querySelector(".restore").addEventListener("click", HANDLERS.handleRestore.bind(null, this, manageUser));
        
        let manageModerator = document.querySelectorAll(".usersContainer")[1];
        manageModerator.addEventListener("scroll", HANDLERS.handleUsersScroll.bind(null, this, manageModerator));
        document.querySelectorAll(".manageUsers")[1].querySelector(".adminSearchUser").addEventListener("click", HANDLERS.handleUserSearch.bind(null, this, manageModerator));
        document.querySelectorAll(".manageUsers")[1].querySelector(".restore").addEventListener("click", HANDLERS.handleRestore.bind(null, this, manageModerator));
        
        let manageBannedUser = document.querySelectorAll(".usersContainer")[2];
        manageBannedUser.addEventListener("scroll", HANDLERS.handleUsersScroll.bind(null, this, manageBannedUser));
        document.querySelectorAll(".manageUsers")[2].querySelector(".adminSearchUser").addEventListener("click", HANDLERS.handleUserSearch.bind(null, this, manageBannedUser));
        document.querySelectorAll(".manageUsers")[2].querySelector(".restore").addEventListener("click", HANDLERS.handleRestore.bind(null, this, manageBannedUser));

        API.adminGetUsers(1, 1, 10).then(res=>{
            res.results.forEach(element => {
                document.querySelectorAll(".usersContainer")[0].innerHTML += this.createUser({username: element.username, picture: element.user_info.picture});
            });
        })
        API.adminGetModerator(1, 1, 10).then(res=>{
            res.results.forEach(element => {
                manageModerator.innerHTML += this.createModerator({username: element.username, picture: element.user_info.picture});
            });
        })
        API.adminGetBannedUsers(1, 1, 10).then(res=>{
            res.results.forEach(element => {
                manageBannedUser.innerHTML += this.createBannedUser({username: element.username, picture: element.user_info.picture});
            });
        })
        setupBtnClickHandler(this);
    }
}