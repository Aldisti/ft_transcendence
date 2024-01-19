import * as general from "/viewScripts/chat/helpFunction.js"
import * as NOTIFICATION from "/viewScripts/notification/notification.js"
import * as URL from "/API/URL.js"
import * as API from "/API/APICall.js";

function sendSocketMessage(e){
    let message = e.target.parentNode.querySelector("textarea");
    let chatBox = document.querySelector(".chatBox")
    let newMessage = {
        type: chatBox.getAttribute("name") == "global" ? "global" : "private",
        receiver: chatBox.getAttribute("name"),
        sender: localStorage.getItem("username"),
        body: message.value,
        sent_time: general.getTimeStamp()
    }

    general.localStoragePush(newMessage);
    delete newMessage.sender;
    socket.send(JSON.stringify(newMessage))
    general.updateChatHistory(chatBox.getAttribute("name"));
    chatBox.scrollTop = chatBox.scrollHeight;
    message.value = "";
}

let socket;
if (localStorage.getItem("token") != null)
{
    API.getTicket(1).then(res=>{
        console.log("hey", res)
        socket = new WebSocket(`${URL.socket.CHAT_SOCKET}?ticket=${res.ticket}`);

        socket.addEventListener('message', (event) => {
            let chatBox = document.querySelector(".chatBox")
            let parsedMessage = JSON.parse(event.data)
        
            console.log("ho ricevuto qualcosa", event.data)
            if (parsedMessage.sender == localStorage.getItem("username"))
                return;
            general.localStoragePush(parsedMessage);
            NOTIFICATION.simple({title: "Chat", body: `${parsedMessage.sender} has sent a message`})
            if ((chatBox.getAttribute('name') == parsedMessage.sender) || (chatBox.getAttribute('name') && parsedMessage.type == "global"))
            {
                general.updateChatHistory(parsedMessage.sender);
                chatBox.scrollTop = chatBox.scrollHeight;
                let list = document.querySelectorAll(".userMessage");
                list[list.length - 1].classList.add("last");
                setTimeout(() => {
                    list[list.length - 1].classList.remove("last");
                
                }, 1000);
            }
        });
        
        document.querySelector(".submitChatInput").addEventListener("click", sendSocketMessage)
    })
}