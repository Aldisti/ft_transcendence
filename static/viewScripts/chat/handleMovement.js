import * as general from "/viewScripts/chat/helpFunction.js"
import * as API from "/API/APICall.js";


function isChildOfSpecificClass(element, className) {
    return element.closest("." + className) !== null;
}

function getUserClicked(element, className){
    return element.closest("." + className)
}

if (localStorage.getItem("chat") == null)
    localStorage.setItem("chat", JSON.stringify({gpanico:[], global: []}));

window.finish = true;

//LISTENERS------

export function hoverHandle(e){

    if (window.innerWidth - e.clientX < 50 && window.finish && !e.target.classList.contains("chat"))
    {
        window.finish = false;
        document.querySelector(".chatContainer").classList.toggle("showUserList");
        setTimeout(() => {
            window.finish = true;
        }, 1000);
    }
    else if ((document.querySelector(".chatContainer").classList.contains("fullOpen") || document.querySelector(".chatContainer").classList.contains("showUserList")) && !e.target.classList.contains("chat") && window.finish)
    {
        window.finish = false;
        if (document.querySelector(".chatContainer").classList.contains("fullOpen"))
            document.querySelector(".chatContainer").classList.toggle("fullOpen");
        if (document.querySelector(".chatContainer").classList.contains("showUserList"))
            document.querySelector(".chatContainer").classList.toggle("showUserList");
        setTimeout(() => {
            window.finish = true;
        }, 1000);
    }
}

export function clickHandle(e){
    let input = document.querySelector("#chatInputElement");

    if (isChildOfSpecificClass(e.target, "userLine"))
    {
        let chatBox = document.querySelector(".chatBox")
        let username = getUserClicked(e.target, "userLine").querySelector(".nameContainer").getAttribute('name');

        if (chatBox.name != username)
            input.value = "";
        chatBox.setAttribute('name', username)
        general.updateChatHistory(username);
        chatBox.scrollTop = chatBox.scrollHeight;
        if (!document.querySelector(".chatContainer").classList.contains("fullOpen"))
            document.querySelector(".chatContainer").classList.add("fullOpen");
    }
}
