import * as general from "/viewScripts/chat/helpFunction.js"
import * as API from "/API/APICall.js";

export const global = {
    username: "global",
    picture: "https://i.pinimg.com/originals/7d/34/d9/7d34d9d53640af5cfd2614c57dfa7f13.png",
    status: true
}


//function that append to the chat user container a line with friend info
export function createUser(info){
    let userLine = `
        <div tabindex="-1" class="chat userLine">
            <div class="nameContainer chat" name="${info.username}">
                ${info.username}
            </div>
            <div tabindex="-1" class="chat chatUserPict">
            ${info.username == "global" ? `<img class="chat" src="/imgs/globe.png">` : `<img class="chat" src="${info.picture != null ? info.picture : "/imgs/defaultImg.jpg"}">`}
            </div>
        </div>
    `
    document.querySelector(".chatSideList").innerHTML += userLine; 
}

//function that append to the chat user container a line with friend info
export function createTitle(){
    if (document.querySelector(".chatBox").getAttribute("name") != "global")
    {
        API.getUserInfo(document.querySelector(".chatBox").getAttribute("name")).then(res=>{
            let userLine = `
                <div tabindex="-1" class="chat chatTitleLine">
                    <div tabindex="-1" class="imgTitle chat">
                        <img class="chat" src="${res.user_info.picture != null ? res.user_info.picture : "/imgs/defaultImg.jpg"}">
                    </div>

                    <a tabindex="-1" class="chat" href="/user/?username=${document.querySelector(".chatBox").getAttribute("name")}" data-link>
                        <h2 tabindex="-1" class=" chat">
                            ${document.querySelector(".chatBox").getAttribute("name")}
                        </h2>
                    </a>
                    <img tabindex="-1" class="menu chat" src="/imgs/menu.jpg">
                    <div tabindex="-1" class="chatUserMenu chat">
                        <div tabindex="-1" class="chat chatUserMenuLine">
                            <h3 tabindex="-1" class="chat">Block User</h3>
                        </div>
                        <div tabindex="-1" class="chat chatUserMenuLine">
                            <h3 tabindex="-1" class="chat">Invite</h3>
                        </div>
                    </div>
                </div>
            `
            document.querySelector(".chatTitle").innerHTML = userLine; 
            document.querySelector(".menu").addEventListener("click", ()=>{
                document.querySelector(".chatUserMenu").classList.toggle("chatUserMenuDisplay")
            })
        })
    }
    else
    {
        let userLine = `
        <div tabindex="-1" class="chat chatTitleLine">
            <div tabindex="-1" class="imgTitle chat">
                <img tabindex="-1" class="chat" src="/imgs/globe.png">
            </div>
            <h2 tabindex="-1" class=" chat">
                ${document.querySelector(".chatBox").getAttribute("name")}
            </h2>
        </div>
    `
    document.querySelector(".chatTitle").innerHTML = userLine;        
    }
}

//function that given a message it build the html code for the message ready to be appended
export function createMessage(message){
    let messageEl = `
        <div tabindex="-1" class="messageLine chat actualChat">
            <div tabindex="-1" class="${message.sender == localStorage.getItem("username") ? `reply rightColor` : `userMessage leftColor`} chat actualChat">
                <a tabindex="-1" class="chat" href="/user/?username=${message.sender == localStorage.getItem("username") ? localStorage.getItem("username") : message.sender }" data-link>
                    <div tabindex="-1" class=" chat chatUsername actualChat">
                        ${message.sender == localStorage.getItem("username") ? `Tu` : message.sender }
                    </div>
                </a>
                <span tabindex="-1" class="chat textContainer actualChat">
                    ${window.escapeHtml(message.body)}
                </span>
            </div>
            <span tabindex="-1" class="chat actualChat ${message.sender == localStorage.getItem("username") ? `messageRight ` : ``}">
                <span class="chat actualChat">${general.getTimeSplitted(message.sent_time)}</span>
            </span>
        </div>
    `
    return messageEl;
}