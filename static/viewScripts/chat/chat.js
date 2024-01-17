import * as create from "/viewScripts/chat/createChatItem.js"
import * as listener from "/viewScripts/chat/handleMovement.js"
import * as API from "/API/APICall.js";

let infoSleep = {
    username: "gpanico",
    picture: "https://i.pinimg.com/originals/7d/34/d9/7d34d9d53640af5cfd2614c57dfa7f13.png",
    status: true
}
let infoSleep2 = {
    username: "mpaterno",
    picture: "https://i.pinimg.com/originals/7d/34/d9/7d34d9d53640af5cfd2614c57dfa7f13.png",
    status: true
}
let global = {
    username: "global",
    picture: "https://i.pinimg.com/originals/7d/34/d9/7d34d9d53640af5cfd2614c57dfa7f13.png",
    status: true
}

//defining Listener for general MOUSE HOVER event
document.addEventListener("mousemove", listener.hoverHandle)

//defining Listener for user menu MOUSE CLICK event
document.querySelector(".chatSideList").addEventListener("click", listener.clickHandle)

//defining Listener for input submit MOUSE CLICK event
document.querySelector(".submitChatInput").addEventListener("click", listener.sendSocketMessage)

API.getFriends(1).then(users=>{
    for (let i = 0; i < users.length; i++)
        create.createUser(users[i]);
})
create.createUser(global);
// create.createUser(infoSleep2);

