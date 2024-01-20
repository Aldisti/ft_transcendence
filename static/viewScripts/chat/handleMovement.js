import * as general from "/viewScripts/chat/helpFunction.js"
import * as create from "/viewScripts/chat/createChatItem.js"

//check if ELEMENT is child of a parentNode with CLASSNAME class
function isChildOfSpecificClass(element, className) {
    return element.closest("." + className) !== null;
}

//return the closest element with CLASSNAME starting from ELEMENT
function getUserClicked(element, className){
    return element.closest("." + className)
}

if (localStorage.getItem("chat") == null)
    localStorage.setItem("chat", JSON.stringify({global: []}));

window.finish = true;
window.userList = true;

//function responsible for chat component movement 
export function hoverHandle(e){
    if (window.innerWidth > 900)
    {
        //show user list element when hoverig on outer container
        if (e.target.classList.contains("chatContainer") && document.querySelector(".chatSideList").classList.contains("hideUsersList") && window.userList)
            document.querySelector(".chatSideList").classList.remove("hideUsersList")
    
        //hide user list element when hoverig on outer container
        if (e.target.classList.contains("actualChat") && !document.querySelector(".chatSideList").classList.contains("hideUsersList"))
        {
            document.querySelector(".chatSideList").classList.toggle("hideUsersList")
        }
        //defining the side width to trigger the chat open
        if (window.innerWidth - e.clientX < 50 && window.finish && !e.target.classList.contains("chat"))
        {
            window.finish = false;
            document.querySelector(".chatContainer").classList.toggle("showUserList");
            setTimeout(() => {
                window.finish = true;
            }, 1000);
        }
    
        //handle the chat container close movement
        else if ((document.querySelector(".chatContainer").classList.contains("fullOpen") || document.querySelector(".chatContainer").classList.contains("showUserList")) && !e.target.classList.contains("chat") && window.finish)
        {
            window.finish = false;
    
            //if full open will close the chat
            if (document.querySelector(".chatContainer").classList.contains("fullOpen"))
                document.querySelector(".chatContainer").classList.toggle("fullOpen");
    
            //if the users tab is visible and hover out close the tab
            if (document.querySelector(".chatContainer").classList.contains("showUserList"))
                document.querySelector(".chatContainer").classList.toggle("showUserList");
            setTimeout(() => {
                window.finish = true;
            }, 1000);
        }
    }

}

//handle chat movement on click input
export function clickHandle(e){
    let input = document.querySelector("#chatInputElement");

    //if clicked element is a user line this will open a chat with related user
    if (isChildOfSpecificClass(e.target, "userLine"))
    {
        let chatBox = document.querySelector(".chatBox")
        let username = getUserClicked(e.target, "userLine").querySelector(".nameContainer").getAttribute('name');

        //reset the input value on user chat switch
        if (chatBox.name != username)
            input.value = "";

        //change name attribute to the chatbox element to later be used as reference when building the message to be send
        chatBox.setAttribute('name', username)

        create.createTitle();

        //update the displayed chat based on the new selected user
        general.updateChatHistory(username);
        chatBox.scrollTop = chatBox.scrollHeight;

        //show the CHAT BOX if it was not yet opened
        if (!document.querySelector(".chatContainer").classList.contains("fullOpen"))
            document.querySelector(".chatContainer").classList.add("fullOpen");

        //collapse the users tab under the CHAT BOX element
        document.querySelector(".chatSideList").classList.toggle("hideUsersList");

        window.userList = false;
        setTimeout(() => {
            window.userList = true;
        }, 1000);
    }
}
