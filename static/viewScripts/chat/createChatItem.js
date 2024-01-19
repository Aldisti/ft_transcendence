import * as general from "/viewScripts/chat/helpFunction.js"

export const global = {
    username: "global",
    picture: "https://i.pinimg.com/originals/7d/34/d9/7d34d9d53640af5cfd2614c57dfa7f13.png",
    status: true
}

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

export function createMessage(message){
    let messageEl = `
        <div class="messageLine chat">
            <div class="${message.sender == localStorage.getItem("username") ? `reply rightColor` : `userMessage leftColor`} chat">
                <div class=" chat chatUsername">
                    ${message.sender == localStorage.getItem("username") ? `Tu` : message.sender }
                </div>
                <span class="chat textContainer">
                    ${message.body}
                </span>
            </div>
            <span class="chat ${message.sender == localStorage.getItem("username") ? `messageRight ` : ``}">
                <span>${general.getTimeSplitted(message.sent_time)}</span>
            </span>
        </div>
    `
    return messageEl;
}