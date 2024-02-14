
import * as NOTIFICATION from "/viewScripts/notification/notification.js"
import * as URL from "/API/URL.js"
import * as create from "/viewScripts/chat/createChatItem.js"
import * as API from "/API/APICall.js";
import * as notificationView from "/viewScripts/notification/notificationViewRouter.js";
import Router from "/router/mainRouterFunc.js"

function removeNotification(body){
    let parsedNotification = JSON.parse(localStorage.getItem("notification"));

    parsedNotification.forEach((element, i) => {
        if (element.body == body)
            parsedNotification.splice(i, 1);
    });
    localStorage.setItem("notification", JSON.stringify(parsedNotification));
    if (document.querySelector(".friendRequestContainer") != null){
        document.querySelector(".friendRequestContainer").innerHTML = ""
        document.querySelector(".infoContainer").innerHTML = ""
    
        for (let i = 0; i < parsedNotification.length; i++)
            notificationView.notificationRouter(parsedNotification[i]);
    }
}

//handle user choice in case of friend request notificationElement rapresent the the newly created notification element
function choiceCallback(config, notificationElement){

    //setting up a listener for ACCEPT button
    notificationElement.querySelector(".notificationAccept").addEventListener("click", ()=>{
        let currentSearchedUser = document.querySelector(".userAndImage") != undefined ? document.querySelector(".userAndImage h2").innerHTML : null;

        //api call is perfomed passing a token as handshake for server
        API.acceptRequest(1, config.token)
        removeNotification(config.fullBody)
        
        //update friend button inner text if the user is looking at it
        if (config.body.split(" ")[0] == currentSearchedUser)
            document.querySelector(".askFriend h3").innerHTML = "Remove Friend";

        //make the notification disappear
        document.body.removeChild(notificationElement);
    })

    //setting up a listener for DENY button
    notificationElement.querySelector(".notificationDeny").addEventListener("click", ()=>{
        //api call is perfomed passing a token as handshake for server
        API.denyRequest(1, config.token)
        removeNotification(config.fullBody)

        //make the notification disappear
        document.body.removeChild(notificationElement);
    })
}

//handle notification of type INFO
function infoNotification(notification){
    let currentSearchedUser = document.querySelector(".userAndImage") != undefined ? document.querySelector(".userAndImage h2").innerHTML : null;

    //create the notification with NOTIFICATION functions
    NOTIFICATION.simple({title: "Info", body: notification.body})

    //handle the case of someone removed the user form friend
    if (notification.body.substring(notification.body.indexOf(" ")) == " is no more your friend")
    {
        //change friend button inner text if the current user display is the same of the one who removed the current user from friend
        if (currentSearchedUser == notification.body.split(" ")[0])
            document.querySelector(".askFriend h3").innerHTML = "Add Friend";

        //update friend list on chat element
        API.getFriends(1).then(users=>{
            document.querySelector(".chatSideList").innerHTML = ""; 
            create.createUser(create.global);
            console.log(users)
            for (let i = 0; i < users.length; i++)
                create.createUser(users[i]);
        })
    }

    //handle the case of someone removed the user form friend
    else if (notification.body.substring(notification.body.indexOf(" ")) == " accepted your friends request")
    {

        //change friend button inner text if the current user display is the same of the one who added the current user to his friend
        if (currentSearchedUser == notification.body.split(" ")[0])
            document.querySelector(".askFriend h3").innerHTML = "Remove Friend";

        //update friend list on chat element  
        API.getFriends(1).then(users=>{
            document.querySelector(".chatSideList").innerHTML = "";
            create.createUser(create.global);
            for (let i = 0; i < users.length; i++)
                create.createUser(users[i]);
        })
    }
}

//send a choice notification that can be acceoted or denied
function friendNotification(obj){
    let sender = obj.body.split("=")[2];
    let config = {
        title: "Friend Request",
        deny: "Deny friend request",
        accept: "accept friend request",
        body: `${sender} sent a friendship request`,
        token: obj.body.split(",")[0].split("=")[1],
        fullBody: obj.body
    }

    //the action to do in case of accept or deny is defined in choiceCallback
    NOTIFICATION.choice(config, choiceCallback)
}

function tournamentCallback(config, notificationElement){
    let token = config.notification.token;
    let tournamentId = config.notification.tournament_id;
    let opponentDisplay = config.notification.opponentDisplay;
    let opponent = config.notification.opponent;
    let userDisplay = config.notification.display;

    notificationElement.querySelector(".notificationAccept").addEventListener("click", ()=>{
        history.pushState(null, null, `/games/pong2d/?token=${btoa(token)}&tournament=${btoa(tournamentId)}&opponentDisplay=${atob(opponentDisplay)}&opponent=${atob(opponent)}&userDisplay=${atob(userDisplay)}`);
        Router();
        document.body.removeChild(notificationElement);
    });
    notificationElement.querySelector(".notificationDeny").addEventListener("click", ()=>{
        document.body.removeChild(notificationElement);
    });
}

function matchReqNotification(notification){
    let config = {
        notification: notification,
        title: "Tournament",
        accept: "enter Tournament Match",
        deny: "reject",
        body: "incoming Tournament match...",
        permanent: true
    }
    NOTIFICATION.choice(config, tournamentCallback)
    console.log(notification);
}

function notificationRouter(notification){
    if (notification.type == "info")
        infoNotification(notification);
    // else if (notification.type == "ban")
    //     banNotification();
    // else if (notification.type == "alert")
    //     handleFriendNotification(notification);
    else if (notification.type == "friend_req")
        friendNotification(notification);
    else if (notification.type == "match_req")
        matchReqNotification(notification);
}

function updateNotification(newNotifications){
    let parsedSavedNotification = JSON.parse(localStorage.getItem("notification"));
    newNotifications.forEach(element => {
        parsedSavedNotification.push(element);
    });
    localStorage.setItem("notification", JSON.stringify(parsedSavedNotification));
}

let socket = null;

//check if the user is logged in
export function start(){
    if (socket !== null && socket.readyState !== WebSocket.CLOSED)
        return ;
    //get tiket from server to establish a connection with notification socket
    API.getTicket(1, URL.socket.NOTIFICATION_SOCKET_TICKET).then(res=>{

        //establish connection with socket
        socket = new WebSocket(`${URL.socket.NOTIFICATION_SOCKET}?ticket=${res.ticket}&username=${localStorage.getItem("username")}`);
        
        //define a listener that wait for INCOMING NOTIFICATION
        socket.addEventListener("message", (message)=>{
            let parsed = JSON.parse(message.data);

            if (localStorage.getItem("notification") == null)
                localStorage.setItem("notification", message.data)
            else
                updateNotification(parsed);

        
            //since the retrieved obj contain an array of notification this will loop trought it and decide what to do based on type
            for (let i = 0; i < parsed.length; i++)
                notificationRouter(parsed[i]);
        })
    })
}

export function close(){
    if (socket != null){
        socket.close();
        console.log("ntf closed")
    }
}