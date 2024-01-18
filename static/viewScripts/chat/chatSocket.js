import * as general from "/viewScripts/chat/helpFunction.js"
import * as NOTIFICATION from "/viewScripts/notification/notification.js"
import * as URL from "/API/URL.js"


const socket = new WebSocket(URL.socket.CHAT_SOCKET);

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

export default socket;