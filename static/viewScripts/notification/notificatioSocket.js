import * as notSimple from "/viewScripts/notification/mainNotification.js"


const socket = new WebSocket("ws://localhost:8000/ws/notification/socket/");

// function atachNotification(notificationObj, conf, permanent){
//     let parser = new DOMParser();
//     let notification = `
//         <div class="notificationContainer">
//             <div class="notificationClose">
//                 X
//             </div>
//             ${conf.title !== undefined ? `<h4>${conf.title}</h4>` : ``}
//             <div class="notificationBody">
//                 <span>
//                     ${notificationObj.body}
//                 </span>
//             </div>
//             ${conf.option !== undefined ? `
//             <div class="notificationBtns">
//                 <button class="notificationBtn notificationDeny">
//                     ${conf.option.deny}
//                 </button>
//                 <button class="notificationBtn notificationAccept">
//                     ${conf.option.accept}
//                 </button>
//             </div>
//             `: ``}
//         </div>
//     `
//     let doc = parser.parseFromString(notification, 'text/html');
//     let notificationElement = doc.body.firstChild;

//     document.body.appendChild(notificationElement);
//     if (permanent != undefined)
//         notificationElement.querySelector(".notificationClose").addEventListener("click", ()=>{
//             document.body.removeChild(notificationElement);
//         })
//     if (permanent == undefined)
//     {
//         setTimeout(() => {
//             document.body.removeChild(notificationElement)
//         }, 5000);
//     }
//     if (conf.option != undefined){
//         notificationElement.querySelector(".notificationAccept").addEventListener("click", ()=>{
//             API.acceptRequest(1, notificationObj.token)
//         })
//         notificationElement.querySelector(".notificationDeny").addEventListener("click", ()=>{
//             API.denyRequest(1, notificationObj.token)
//         })
//     }
// }

function handleInfoNotification(notification){
    notSimple.simpleNotification("Info", notification.body)
}
function handleBanNotification(){

}
function handleFriendNotification(obj){
    let config = {
        title: "Friend Request",
        option: {
            deny: "Deny friend request",
            accept: "accept friend request",
        }
    }
    let sender = obj.body.split("=")[2];
    notSimple.atachNotification({body: `${sender} sent a friendship request`, token: obj.body.split(",")[0].split("=")[1]}, config, 1)

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

    for (let i = 0; i < parsed.length; i++)
        notificationRouter(parsed[i]);
})

export default socket;