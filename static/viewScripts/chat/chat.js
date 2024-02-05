import * as create from "/viewScripts/chat/createChatItem.js"
import * as listener from "/viewScripts/chat/handleMovement.js"
import * as API from "/API/APICall.js";


//first check if the user is logged if so ask the server for the user frinds to build the chat element
export default function startChatListeners(){

    //create the GLOBAL chat for all registered users
    create.createUser(create.global);

    //perfome the call to retrieve the friends list
    API.getFriends(1).then(users=>{

        // create a line for each friend in chat element
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

