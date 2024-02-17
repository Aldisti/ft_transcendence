import * as API from "/API/APICall.js";

export function removeNotification(body){
    let parsedNotification = JSON.parse(localStorage.getItem("notification"));

    parsedNotification.forEach((element, i) => {
        if (element.body == body)
            parsedNotification.splice(i, 1);
    });
    localStorage.setItem("notification", JSON.stringify(parsedNotification));
    document.querySelector(".friendRequestContainer").innerHTML = ""
    document.querySelector(".infoContainer").innerHTML = ""
    for (let i = 0; i < parsedNotification.length; i++)
        notificationRouter(parsedNotification[i]);

}

export function handleDenyRequest(token, notification){
    //api call is perfomed passing a token as handshake for server
    API.denyRequest(1, token);
    removeNotification(notification);
}

export function handleAcceptRequest(token, notification){
    let currentSearchedUser = document.querySelector(".userAndImage") != undefined ? document.querySelector(".userAndImage h2").innerHTML : null;
    
    //api call is perfomed passing a token as handshake for server
    API.acceptRequest(1, token)
    
    removeNotification(notification);
}

export function makeChoiceCard(notificationContent){
    let notification = `
    <div class="choiceCardContainer">
        <div class="paddingBox">

        <h4>${window.escapeHtml(notificationContent.title)}</h4>
        <div class="choiceCardBody" body="${notificationContent.fullBody}">
            <span>
                ${window.escapeHtml(notificationContent.body)}
            </span>
        </div>
        <div class="timeStamp">
            <span>
                ${notificationContent.time.split(":")[0]}
            </span>
            <span>
                ${notificationContent.time.split(":")[1].split(".")[0]}:${notificationContent.time.split(":")[1].split(".")[1]}
            </span>
        </div>
        </div>
        <div class="choiceCardBtns">
            <button token="${notificationContent.token}" class="choiceCardBtn choiceCardDeny">
                ${window.escapeHtml(notificationContent.deny)}
            </button>
            <button token="${notificationContent.token}" class="choiceCardBtn choiceCardAccept">
                ${window.escapeHtml(notificationContent.accept)}
            </button>
        </div>
    </div>
    `
    return notification
}

export function makeSimpleCard(obj){
    let notification = `
        <div class="simpleCardContainer">
            <div class="paddingBox">
                <div class="simpleCardTitle">
                    <h4>${obj.title}</h4>
                    <div class="simpleCardCloseBtn">
                        X
                    </div>
                </div>
                <div class="simpleCardBody">
                    <span>
                        ${obj.body}
                    </span>
                </div>
            </div>
            <div class="timeStamp">
                <span>
                    ${obj.time.split(":")[0]}
                </span>
                <span>
                    ${obj.time.split(":")[1].split(".")[0]}:${obj.time.split(":")[1].split(".")[1]}
                </span>
            </div>
        </div>
    `
    return notification;
}

export function infoNotification(obj){
    let notificationList = document.querySelector(".infoContainer");
    
    notificationList.innerHTML += makeSimpleCard({title: "Info", body: obj.body, time: obj.sent_time});
}

export function friendNotification(obj){
    let sender = obj.body.sender;
    let notificationList = document.querySelector(".friendRequestContainer");
    let config = {
        title: "Friend Request",
        deny: "Deny friend request",
        accept: "accept friend request",
        body: `${sender} sent a friendship request`,
        token: obj.body.token,
        time: obj.sent_time,
        fullBody: obj.body
    }
    notificationList.innerHTML += makeChoiceCard(config);
    // let choicheNotifications = document.querySelectorAll(".choiceCardContainer");

    // choicheNotifications[choicheNotifications.length - 1].querySelector(".choiceCardAccept").addEventListener("click", handleAcceptRequest.bind(null, config, obj));
    // choicheNotifications[choicheNotifications.length - 1].querySelector(".choiceCardDeny").addEventListener("click", handleDenyRequest.bind(null, config, obj));
}

export function setuplistenerToRemoveNotification(){
    let allInfoNotification = document.querySelector(".infoContainer");
    allInfoNotification.addEventListener("click", (e)=>{
        if (e.target.classList.contains("simpleCardCloseBtn"))
        {
            let card = e.target.parentNode.parentNode;
            removeNotification(card.querySelector(".simpleCardBody span").innerHTML.trim(), allInfoNotification)
            // card.parentNode.removeChild(card);
        }
    })
    
    let allChoiceNotification = document.querySelector(".friendRequestContainer");
    allChoiceNotification.addEventListener("click", (e)=>{
        if (e.target.tagName == "BUTTON"){
            let token = e.target.getAttribute("token");
            let body = e.target.parentNode.parentNode.querySelector(".choiceCardBody").getAttribute("body");
    
            if (e.target.classList.contains("choiceCardAccept"))
                handleAcceptRequest(token, body);
            else if(e.target.classList.contains("choiceCardDeny"))
                handleDenyRequest(token, body);
        }
           
    })
}

export function notificationRouter(notification){
    if (notification.type == "info")
        infoNotification(notification);
    // else if (notification.type == "ban")
    //     banNotification();
    // else if (notification.type == "alert")
    //     handleFriendNotification(notification);
    else if (notification.type == "friend_req")
        friendNotification(notification);
    else if (notification.type == "match_req"){
        console.log(notification, "ciao")
    }
}