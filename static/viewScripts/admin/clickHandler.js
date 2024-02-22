import * as API from "/API/APICall.js"
import * as HANDLERS from "/viewScripts/admin/scrollHandlers.js"


function restoreAll(dupThis){
    HANDLERS.handleRestore(dupThis, document.querySelectorAll(".usersContainer")[0])
    HANDLERS.handleRestore(dupThis, document.querySelectorAll(".usersContainer")[1])
    HANDLERS.handleRestore(dupThis, document.querySelectorAll(".usersContainer")[2])

}

function removeUser(username, dupThis){
    if (confirm(`${dupThis.language.admin.removeUser}${username}?`)){
        API.removeUser(1, username).then(()=>{
            restoreAll(dupThis);
        })
    }
}
function makeUserModerator(username, dupThis){
    API.manageModerator(1, username, "M").then(()=>{
        restoreAll(dupThis);
    })
}
function makeModeratorUser(username, dupThis){
    API.manageModerator(1, username, "U").then(()=>{
        restoreAll(dupThis);
    })
}
function banUser(username, dupThis){
    API.manageUserBan(1, username, true).then(()=>{
        restoreAll(dupThis);
    })
}
function unbanUser(username, dupThis){
    API.manageUserBan(1, username, false).then(()=>{
        restoreAll(dupThis);
    })
}

let handleClick = (dupThis, e)=>{
    let username = e.target.getAttribute("username");

    if (e.target.classList.contains("delete"))
        removeUser(username, dupThis)
    else if (e.target.classList.contains("makeModerator"))
        makeUserModerator(username, dupThis)
    else if (e.target.classList.contains("removeModerator"))
        makeModeratorUser(username, dupThis)
    else if (e.target.classList.contains("ban"))
        banUser(username, dupThis)
    else if (e.target.classList.contains("undoBan"))
        unbanUser(username, dupThis)
}

export default function setupBtnClickHandler(dupThis){
    document.querySelectorAll(".usersContainer").forEach(el=>{
        el.addEventListener("click", handleClick.bind(null, dupThis))
    })
}