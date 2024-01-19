import * as create from "/viewScripts/chat/createChatItem.js"

export function chatInitializer(userArray){
    let chatHistory;

    if (localStorage.getItem("chat") == null)
        localStorage.setItem("chat", "{}");
    chatHistory = JSON.parse(localStorage.getItem("chat"));
    for (let i = 0; i < userArray.length; i++)
    {
        if (chatHistory[userArray[i].username] == undefined)
            chatHistory[userArray[i].username] = [];
    }
    localStorage.setItem("chat", JSON.stringify(chatHistory));
}

export function localStoragePush(obj){
    let chatString = localStorage.getItem("chat") != null ? localStorage.getItem("chat") : "{}";
    let toAdd = JSON.parse(chatString);
    let username = obj.sender == localStorage.getItem("username") ? document.querySelector(".chatBox").getAttribute('name') : obj.sender;
    if (obj.type == "global")
        username = "global";

    if (toAdd[username] == undefined)
        toAdd[username] = [];
    if (toAdd[username].length > 100)
        toAdd[username].shift();
    toAdd[username].push(obj)
    localStorage.setItem("chat", JSON.stringify(toAdd));
}

export function updateChatHistory()
{
    let chatHistory = ""
    let username = document.querySelector(".chatBox").getAttribute('name');
    let chat = JSON.parse(localStorage.getItem("chat"))[username];
    
    if (chat != undefined)
    {
        for (let i = 0; i < chat.length; i++)
            chatHistory += create.createMessage(chat[i]);
        document.querySelector(".chatBox").innerHTML = chatHistory;
    }
}

export function getTimeSplitted(str){
    let time = str.split(":")[1];
    let hour = time.split(".")[0];
    let minute = time.split(".")[1];


    return (`${hour}:${minute}`);
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

export function getTimeStamp() {
    const currentDate = new Date();
  
    const year = currentDate.getFullYear();
    const month = padZero(currentDate.getMonth() + 1); // Months are zero-indexed
    const day = padZero(currentDate.getDate());
    const hours = padZero(currentDate.getHours());
    const minutes = padZero(currentDate.getMinutes());
    const seconds = padZero(currentDate.getSeconds());
  
    return `${year}/${month}/${day}:${hours}.${minutes}.${seconds}`;
  }