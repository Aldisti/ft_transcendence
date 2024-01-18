import Aview from "/views/abstractView.js";
import * as API from "/API/APICall.js";


let obj = {
    username: "mpaterno",
    picture: "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg",
}
let obj1 = {
    username: "gpanico",
    picture: "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg",
}
let obj2 = {
    username: "aldisti",
    picture: "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg",
}

let objs = [obj, obj1, obj2, obj, obj, obj, obj, obj, obj, obj, obj, obj, obj, obj, obj, obj, obj, obj]

export default class extends Aview {
    constructor() {
        super();
    }
     createUser(obj){
        return `
            <a class="userBox" href="/user/?username=${obj.username}" data-link>
                <h2>${obj.username}</h2>
                <div class="imgContainer">
                    <img class="profPict" src="${obj.user_info.picture}">
                </div>
            </a>
        `
    }
    concatenateUsers(objs){
        let users = "";

        for (let i = 0; i < objs.length; i++)
            users += this.createUser(objs[i]);
        return users;
    }
    getHtml(){
        let urlParams = new URLSearchParams(window.location.search);

        return `
            <div class="base">
                <div class="userContainer">
                    ${this.concatenateUsers(objs)}
                </div>
            </div>
        `
    }
    setup(){
        this.defineWallpaper("/imgs/backLogin.png", "https://images.unsplash.com/photo-1587066533626-c9a67b27b0a8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
        API.getUsers(1).then(res=>{
            document.querySelector(".userConatiner").innerHTML = this.concatenateUsers(res.results);
        })
    }
}