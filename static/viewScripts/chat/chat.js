import * as create from "/viewScripts/chat/createChatItem.js"
import * as listener from "/viewScripts/chat/handleMovement.js"
import * as API from "/API/APICall.js";

if (localStorage.getItem("username") != null)
{
    create.createUser(create.global);
    API.getFriends(1).then(users=>{
        for (let i = 0; i < users.length; i++)
            create.createUser(users[i]);
    })

    
    //defining Listener for general MOUSE HOVER event
    document.addEventListener("mousemove", listener.hoverHandle)

    //defining Listener for user menu MOUSE CLICK event
    document.querySelector(".chatSideList").addEventListener("click", listener.clickHandle)

    //defining Listener for input submit MOUSE CLICK event
    document.querySelector(".submitChatInput").addEventListener("click", listener.sendSocketMessage)
}

