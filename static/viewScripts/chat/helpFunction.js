import * as create from "/viewScripts/chat/createChatItem.js"

//loop trough the freinds of the current user and prepare the chat element with [] for each friend
export function chatInitializer(userArray){
    let chatHistory;

    //check if chat is already setted in localstorage
    if (localStorage.getItem("chat") == null){
        localStorage.setItem("chat", "{`global`: []}");

    }

    //parse the chat item in localstorage to be updated
    console.log(localStorage.getItem("chat"))
    chatHistory = JSON.parse(localStorage.getItem("chat"));
    for (let i = 0; i < userArray.length; i++)
    {

        //append all the new user to chat obj creating a [] to store chat messages
        if (chatHistory[userArray[i].username] == undefined)
            chatHistory[userArray[i].username] = [];
    }

    //send back to localstorage
    localStorage.setItem("chat", JSON.stringify(chatHistory));
}

//handle SENT and INCOMING message updating the localstorage item
export function localStoragePush(obj){
    let chatString = localStorage.getItem("chat") != null ? localStorage.getItem("chat") : "{}";
    let toAdd = JSON.parse(chatString);
    let username = obj.sender == localStorage.getItem("username") ? document.querySelector(".chatBox").getAttribute('name') : obj.sender;

    if (obj.type == "global")
        username = "global";

    //to avoid taking too much space the number of messages is limited to 100 if exedeed the oldest will be removed
    if (toAdd[username].length > 100)
        toAdd[username].shift();

    //push the message to related user chat array
    toAdd[username].push(obj)

    //push the update obj to lacalstorage
    localStorage.setItem("chat", JSON.stringify(toAdd));
}

//update the chat dislay based on CHATBOX name attribute that will change on side menu click
export function updateChatHistory()
{
    let chatHistory = ""
    let username = document.querySelector(".chatBox").getAttribute('name');
    let chat = JSON.parse(localStorage.getItem("chat"))[username];
    
    //loop trough user chat array and use CREATEMESSAGE to create each message then all the messages will be appent to the chat
    if (chat != undefined)
    {
        for (let i = 0; i < chat.length; i++)
            chatHistory += create.createMessage(chat[i]);
        document.querySelector(".chatBox").innerHTML = chatHistory;
    }
}


//simple function that retrieve hour and minute of time sent message that will be used to append the info under each message
export function getTimeSplitted(str){
    let time = str.split(":")[1];
    let hour = time.split(".")[0];
    let minute = time.split(".")[1];


    return (`${hour}:${minute}`);
}

//add 0 if the minute or hour is less that 10 so 9 beacame 09
function padZero(num) {
    return num.toString().padStart(2, '0');
}


//return a timestamp in same format of the one retrieved from server
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