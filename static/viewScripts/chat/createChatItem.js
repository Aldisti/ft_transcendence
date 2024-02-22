import * as general from "/viewScripts/chat/helpFunction.js"
import * as API from "/API/APICall.js";
import Router from "/router/mainRouterFunc.js"
import allLanguage from "/language/language.js"

let language = allLanguage[localStorage.getItem("language")];

export const global = {
    username: "global",
    picture: "https://i.pinimg.com/originals/7d/34/d9/7d34d9d53640af5cfd2614c57dfa7f13.png",
    status: true
}

//function that append to the chat user container a line with friend info
export function createUser(info, status){
    if (localStorage.getItem("chat") == null)
        localStorage.setItem("chat", JSON.stringify({}))
    
    let parsedChat = JSON.parse(localStorage.getItem("chat"));

    if (parsedChat[info.username] == undefined){
        parsedChat[info.username] = [];
        localStorage.setItem("chat", JSON.stringify(parsedChat))
    }
    let userLine = `
        <div tabindex="-1" username="${info.username}" class="chat userLine ${status == "connected" ? "connected" : "disconnected"}">
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

function blockUi(){
    const overlay = document.createElement("div");
    const spinner = document.createElement("div");
    const heading = document.createElement("h1");
    const release = document.createElement("button");

    heading.innerHTML = language.chatElement.reqSent;
    release.setAttribute("id", "releaseBtn");
    overlay.setAttribute("id", "matchReqOverlay");
    spinner.classList.add("spinner-border")
    spinner.classList.add("text-warning")
    release.innerHTML = "Cancel Request"
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "var(--bs-dark)"; // Transparent
    overlay.style.pointerEvents = "auto"; // Prevent clicks from passing through
    overlay.style.zIndex = "999999999999999999"; // Ensure it's above other elements
    overlay.appendChild(release);
    overlay.appendChild(spinner);
    overlay.appendChild(heading);
    document.body.appendChild(overlay);
    document.querySelector("#releaseBtn").addEventListener("click", ()=>{
        document.body.removeChild(document.querySelector("#matchReqOverlay"));
        API.deleteMatchReq(1);
        document.querySelector(".matchReq h3").innerHTML = language.chatElement.restoreChat;
    })
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
                    <div class="menu chat">
                        <a tabindex="-1" class="chat" href="/user/?username=${document.querySelector(".chatBox").getAttribute("name")}" data-link>
                            <h2 tabindex="-1" class=" chat">
                                ${document.querySelector(".chatBox").getAttribute("name")}
                            </h2>
                        </a>
                        &#x2630;
                    </div>
                    <div tabindex="-1" class="chatUserMenu chat">
                        <div tabindex="-1" class="chat chatUserMenuLine unfriendUser">
                            <h3 tabindex="-1" class="chat">${language.chatElement.removeFriend}</h3>
                        </div>
                        <div tabindex="-1" class="chat chatUserMenuLine matchReq">
                            <h3 tabindex="-1" class="chat">${language.chatElement.restoreChat}</h3>
                        </div>
                    </div>
                </div>
            `
            document.querySelector(".chatTitle").innerHTML = userLine; 
            document.querySelector(".menu").addEventListener("click", ()=>{
                document.querySelector(".chatUserMenu").classList.toggle("chatUserMenuDisplay")
            })
            document.querySelector(".unfriendUser").addEventListener("click", ()=>{
                if (confirm("are you sure?")){
                    API.removeFriend(1, document.querySelector(".chatBox").getAttribute("name"));
                    Router()
                }

            })
            document.querySelector(".matchReq").addEventListener("click", (e)=>{
                //to implementer=
                if (document.querySelector(".matchReq h3").innerHTML.trim() == "Invite"){
                    API.sendMatchReq(1, document.querySelector(".chatBox").getAttribute("name")).then(res=>{
                        localStorage.setItem("matchReqToken", res.token);
                    })
                    blockUi();
                    document.querySelector(".matchReq h3").innerHTML = language.chatElement.cancelRequest;
                }
                //to do switch button to cancel request
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
    let isGlobalChat = document.querySelector(".chatBox").getAttribute("name") == "global";
    let messageEl = `
        <div tabindex="-1" class="messageLine chat actualChat">
            <div tabindex="-1" class="${message.sender == localStorage.getItem("username") ? `reply rightColor` : `userMessage leftColor`} chat actualChat">
                ${isGlobalChat ? `
                    <a tabindex="-1" class="chat" href="/user/?username=${message.sender == localStorage.getItem("username") ? localStorage.getItem("username") : message.sender }" data-link>
                        <div tabindex="-1" class=" chat chatUsername actualChat">
                            ${message.sender == localStorage.getItem("username") ? `Tu` : message.sender }
                        </div>
                    </a>
                ` : ``}
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