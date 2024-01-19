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
        <div class="chat userLine">
            <div class="nameContainer chat" name="${info.username}">
                ${info.username}
            </div>
            <div class="chat chatUserPict">
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
                <div class="chat chatTitleLine">
                    <div class="imgTitle chat">
                        <img class="chat" src="${res.user_info.picture != null ? res.user_info.picture : "/imgs/defaultImg.jpg"}">
                    </div>
                    <h2 class=" chat">
                        ${document.querySelector(".chatBox").getAttribute("name")}
                    </h2>
                </div>
            `
            document.querySelector(".chatTitle").innerHTML = userLine; 
        })
    }
    else
    {
        let userLine = `
        <div class="chat chatTitleLine">
            <div class="imgTitle chat">
                <img class="chat" src="/imgs/globe.png">
            </div>
            <h2 class=" chat">
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
        <div class="messageLine chat actualChat">
            <div class="${message.sender == localStorage.getItem("username") ? `reply rightColor` : `userMessage leftColor`} chat actualChat">
                <div class=" chat chatUsername actualChat">
                    ${message.sender == localStorage.getItem("username") ? `Tu` : message.sender }
                </div>
                <span class="chat textContainer actualChat">
                    ${message.body}
                </span>
            </div>
            <span class="chat actualChat ${message.sender == localStorage.getItem("username") ? `messageRight ` : ``}">
                <span class="chat actualChat">${general.getTimeSplitted(message.sent_time)}</span>
            </span>
        </div>
    `
    return messageEl;
}