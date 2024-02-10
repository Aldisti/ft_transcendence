import * as general from "/viewScripts/chat/helpFunction.js"
import * as NOTIFICATION from "/viewScripts/notification/notification.js"
import * as URL from "/API/URL.js"
import * as API from "/API/APICall.js";
import startChatListeners from "/viewScripts/chat/chat.js";

let socket = null;

//function called when chat send button pressed it take the input 
//format as needed and the send the message trough socket
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


//first check if the user is logged then make the connection to the chat socket and set up a listener
export function start(){
    if (socket !== null && socket.readyState !== WebSocket.CLOSED)
        return ;
    //retrieve from the server a ticket used to perform secure connection to the socket
    API.getTicket(1, URL.socket.CHAT_SOCKET_TICKET).then(res=>{

        //actual connection to the socket 
        socket = new WebSocket(`${URL.socket.CHAT_SOCKET}?ticket=${res.ticket}&username=${localStorage.getItem("username")}`);

        //listener for INCOMING MESSAGE
        socket.addEventListener('message', (event) => {
            let chatBox = document.querySelector(".chatBox")
            let parsedMessage = JSON.parse(event.data)
        
            //if the recived message come from the current user do nothing (used for global chat)
            if (parsedMessage.sender == localStorage.getItem("username"))
                return;

            //save the message in LOCAL STORAGE and send notification
            general.localStoragePush(parsedMessage);
            NOTIFICATION.simple({title: "Chat", body: `${parsedMessage.sender} has sent a message`})

            //if the user is already with the received message sender chat open this will update the current chat
            if ((chatBox.getAttribute('name') == parsedMessage.sender) || (chatBox.getAttribute('name') == "global" && parsedMessage.type == "global"))
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

        startChatListeners();
        
        //define listener for CAHT SEND button
        document.querySelector(".submitChatInput").addEventListener("click", sendSocketMessage)
    })
}

export function close(){
    if (socket != null){
        socket.close();
        console.log("chat closed")
    }
}