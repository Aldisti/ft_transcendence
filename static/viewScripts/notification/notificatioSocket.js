
import * as NOTIFICATION from "/viewScripts/notification/notification.js"
import * as URL from "/API/URL.js"
import * as API from "/API/APICall.js";


const socket = new WebSocket(URL.socket.NOTIFICATION_SOCKET);

function choiceCallback(config, notificationElement){
    notificationElement.querySelector(".notificationAccept").addEventListener("click", ()=>{
        let currentSearchedUser = document.querySelector(".userAndImage") != undefined ? document.querySelector(".userAndImage h2").innerHTML : null;
        API.acceptRequest(1, config.token)
        if (config.body.split(" ")[0] == currentSearchedUser)
            document.querySelector(".askFriend h3").innerHTML = "Remove Friend";
        document.body.removeChild(notificationElement);

    })
    notificationElement.querySelector(".notificationDeny").addEventListener("click", ()=>{
        API.denyRequest(1, config.token)
        document.body.removeChild(notificationElement);
    })
}

function handleInfoNotification(notification){
    let currentSearchedUser = document.querySelector(".userAndImage") != undefined ? document.querySelector(".userAndImage h2").innerHTML : null;
    NOTIFICATION.simple({title: "Info", body: notification.body})
    if (notification.body.substring(notification.body.indexOf(" ")) == " isn't no more your friend" && currentSearchedUser == notification.body.split(" ")[0])
        document.querySelector(".askFriend h3").innerHTML = "Add Friend";
    if (notification.body.substring(notification.body.indexOf(" ")) == " accepted your friends request" && currentSearchedUser == notification.body.split(" ")[0])
        document.querySelector(".askFriend h3").innerHTML = "Remove Friend";


    console.log(notification)
}
function handleBanNotification(){

}
function handleFriendNotification(obj){
    let sender = obj.body.split("=")[2];
    let config = {
        title: "Friend Request",
        deny: "Deny friend request",
        accept: "accept friend request",
        body: `${sender} sent a friendship request`,
        token: obj.body.split(",")[0].split("=")[1]
    }
    NOTIFICATION.choice(config, choiceCallback)
    // notSimple.atachNotification({body: `${sender} sent a friendship request`, token: obj.body.split(",")[0].split("=")[1]}, config, 1)
}

function notificationRouter(notification){
    console.log(notification)
    if (notification.type == "info")
        handleInfoNotification(notification);
    else if (notification.type == "ban")
        handleBanNotification();
    else if (notification.type == "alert")
        handleFriendNotification(notification);
    else if (notification.type == "friend_req")
        handleFriendNotification(notification);
    else if (notification.type == "match_req")
        handleFriendNotification();
}

socket.addEventListener("message", (message)=>{
    let parsed = JSON.parse(message.data);
    console.log(parsed)

    for (let i = 0; i < parsed.length; i++)
        notificationRouter(parsed[i]);
})

export default socket;