import * as general from "/viewScripts/chat/helpFunction.js"

export function createUser(info){
    let userLine = `
        <div class="chat userLine">
            <div class="nameContainer chat" name="${info.username}">
                ${info.username}
            </div>
            <div class="chat chatUserPict">
                <img class="chat" src="${info.picture}">
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