import * as general from "/viewScripts/chat/helpFunction.js"
import * as notification from "/viewScripts/notification/mainNotification.js"


const socket = new WebSocket("ws://localhost:8000/ws/chat/socket/");

socket.addEventListener('message', (event) => {
    let chatBox = document.querySelector(".chatBox")
    let parsedMessage = JSON.parse(event.data)

    general.localStoragePush(parsedMessage);
    notification.simpleNotification("Chat", `${parsedMessage.sender} has sent a message`)
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