import Aview from "/views/abstractView.js";
import Router from "/router/mainRouterFunc.js"


let data = {
    username: "gpanico",
    picture: ""
}

export default class extends Aview{
    constructor(){
        super();

    }

    createUser(userData){
        return `
        <div class="adminUserLine">
            <div class="upperLine">
                <div class="username">
                    <h3>${userData.username}</h3>
                </div>
                <div class="photo">
                    <img src="${userData.picture == "" ? "/imgs/defaultImg.jpg" : userData.picture}">
                </div>
            </div>
            <div class="bottomLine">
                <button class="block">
                    Block User
                </button>
                <button class="delete">
                    Delete User
                </button>
            </div>
        </div>
        `
    }   

    getHtml(){
        return `
            <div class="base">
                <div class="usersContainer">

                </div>
            </div>
        `
    }

    setup(){
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/secondModernBack.jpeg")
        let isAdmin = JSON.parse(window.decode64(localStorage.getItem("jwt"))).role == "U";
        if (!isAdmin)
        {
            history.pushState(null, null, "/home/");
            Router();
        }
        document.querySelector(".usersContainer").innerHTML += this.createUser(data);

    }
}