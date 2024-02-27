import Router from "/router/mainRouterFunc.js"
import * as create from "/viewScripts/chat/createChatItem.js"
import * as URL from "/API/URL.js"
import * as help from "/viewScripts/chat/helpFunction.js"
import allLanguage from "/language/language.js"
import * as  notificationSocket from "/viewScripts/notification/notificatioSocket.js";
import * as  chatSocket from "/viewScripts/chat/chatSocket.js";
import * as listener from "/viewScripts/chat/handleMovement.js"
import * as NOTIFICATION from "/viewScripts/notification/notification.js"



let language = allLanguage[localStorage.getItem("language")]

function cleanLocalStorage() {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("intraLinked");
    localStorage.removeItem("googleLinked");
    localStorage.removeItem("isActive");
    localStorage.removeItem("selectedForm");
    localStorage.removeItem("chat");
    localStorage.removeItem("jwt");
    localStorage.removeItem("notification");
    notificationSocket.close();
    chatSocket.close();

    //defining Listener for general MOUSE HOVER event
    document.removeEventListener("mousemove", listener.hoverHandle)
    
    //defining Listener for user menu MOUSE CLICK event
    document.querySelector(".chatSideList").removeEventListener("click", listener.clickHandle)

    //defining Listener for input submit MOUSE CLICK event
    document.querySelector(".submitChatInput").removeEventListener("click", listener.sendSocketMessage)

    document.querySelector(".chatSideList").innerHTML = ""
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function refreshAndRetry(retryFunc, ...args) {
    let res = await refreshToken()

    if (!res.ok) {
        cleanLocalStorage();
        history.pushState(null, null, "/login/");
        Router();
        return;
    }
    return await retryFunc(...args);
}

export async function checkForUsernameAvailability(username) {
    const res = await fetch(`${URL.availabilityCheck.USERNAME}?username=${username}`, {
        method: "GET",
    })
    let temp = await res.json()
    if (temp.found == false)
        return (true);
    return (false)
}

export async function checkForEmailAvailability(email) {
    const res = await fetch(`${URL.availabilityCheck.EMAIL}?email=${email}`, {
        method: "GET",
    })
    let temp = await res.json()
    if (temp.found == false)
        return (true);
    return (false)
}

export async function convertIntraToken(code, state) {
    const res = await fetch(URL.general.CONVERT_INTRA_TOKEN, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code: code,
            state: state
        })
    });
    if (res.ok) {
        let token = await res.json();
        localStorage.setItem("token", token.access_token)
        localStorage.setItem("username", token.username);
        history.pushState(null, null, "/");
        // Router();
        return (true);
    }
    return (false);
}
export async function linkIntraAccount(recursionProtection, code, state) {
    const res = await fetch(URL.general.LINK_INTRA_TOKEN_ACCOUNT, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            code: code,
            state: state,
        }),
        credentials: "include",
    });
    if (res.ok) {
        return (true);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(linkIntraAccount, 0, code, state);
    return (false);
}

export async function unlinkIntra(recursionProtection) {
    const res = await fetch(URL.general.UNLINK_INTRA_TOKEN_ACCOUNT, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        localStorage.removeItem("intraLinked");
        return (true);
    }
    if (res.status == 401 && recursionProtection) {
        return await refreshAndRetry(unlinkIntra, 0);
    }
    return (false);
}

export async function unlinkGoogle(recursionProtection) {
    const res = await fetch(URL.auth.UNLINK_GOOGLE_ACCOUNT, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        localStorage.removeItem("googleLinked");
        return (true);
    }
    if (res.status == 401 && recursionProtection) {
        return await refreshAndRetry(unlinkGoogle, 0);
    }
    return (false);
}

export async function getUserInfo(recursionProtection, username) {
    const res = await fetch(`${URL.general.USER_INFO}?username=${username}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
    })
    if (res.ok) {
        let jsonBody = await res.json();
        return (jsonBody);
    }
    if (res.status == 401 && recursionProtection) {
        return await refreshAndRetry(getUserInfo, 0, username);
    }
    return (undefined);
}

export async function login(data) {
    const res = await fetch(URL.userAction.LOGIN, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        let body = await res.json();

        document.querySelector(".loginError").style.display = "flex";
        if (body.message == "user isn't active")
            document.querySelector(".loginError p").innerHTML = language.login.bannedLogin;
    }
    if (res.ok) {
        localStorage.setItem("username", data.username);
        let token = await res.json();
        // if (token.access_token != undefined)
        //     localStorage.setItem("jwt", token.access_token.split(".")[1])
        localStorage.setItem("otp_token", token.token);
        return (token)
    }
}

export async function refreshToken() {
    const res = await fetch(URL.userAction.REFRESH_TOKEN, {
        method: "POST",
        credentials: 'include',
    })
    let resCpy = res;
    try {
        let token = await res.json();
        localStorage.setItem("token", token.access_token);
    } catch (e) {}
    return (resCpy);
}

export async function register(data) {
    const res = await fetch(URL.userAction.REGISTER, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    if (res.status == 201) {
        history.pushState(null, null, "/login/");
        Router();
        return ({});
    } else {
        let body = await res.json()
        return (body);
    }
}

export async function updateInfo(data, recursionProtection) {
    const res = await fetch(URL.userAction.UPDATE_INFO, {
        method: "PUT",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    if (res.ok) {
        Router();
        return ({});
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(updateInfo, data, 0);
    let body = await res.json()
    return (body);
}

export async function updatePassword(recursionProtection, data, dupThis) {
    const res = await fetch(URL.userAction.UPDATE_PASSWORD, {
        method: "PATCH",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(updatePassword, 0, data, dupThis);
    if (!res.ok) {
        document.querySelector(`#${dupThis.language.update.oldPassword[1]}-tooltip`).innerHTML = dupThis.language.update.passwordErrors[0];
        document.querySelectorAll("input")[0].style.backgroundColor = "#A22C29";
        document.querySelectorAll("input")[0].style.color = "white"
    }
    if (res.status == 400) {
        alert("Old password is not correct...")
    }
    if (res.ok){
        history.pushState(null, null, "/account/");
        Router();
    }
    return (res);
}


export async function updateEmail(data) {
    const res = await fetch(URL.userAction.UPDATE_EMAIL, {
        method: "PATCH",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    if (res.ok){
        return (true);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(updateEmail, 0, data);
    return (false);
}

export async function logout(recursionProtection) {
    const res = await fetch(URL.userAction.LOGOUT, {
        method: "POST",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
    });
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(logout, 0);
    if (res.ok) {
        cleanLocalStorage()
        history.pushState(null, null, "/");
        Router();
        return;
    }
    alert("Something went wrong retry...");
    return;
}

export async function logoutAll(recursionProtection) {
    const res = await fetch(URL.userAction.LOGOUT_ALL, {
        method: "POST",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
    });
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(logoutAll, 0);
    if (res.ok) {
        cleanLocalStorage()
        history.pushState(null, null, "/");
        Router();
        return;
    }
    alert("Something went wrong retry...");
    return;
}

export async function getIntraUrl(parameter) {
    const res = await fetch(`${URL.general.INTRA_URL}?type=${parameter}`, {
        credentials: "include",
        method: "GET",
    });
    if (res.ok) {
        let temp = await res.json();
        return (temp.url);
    }
    return ("");
}

export async function uploadImage(recursionProtection, file) {
    const form = new FormData();

    if (file.files.length > 0) {
        form.append("image", file.files[0]);
    }
    const res = await fetch(URL.userAction.UPDATE_PHOTO, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: form
    })
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(uploadImage, 0, file);
    if (res.ok) {
        Router();
    }
}


export async function activateTfa(recursionProtection, type) {
    const res = await fetch(URL.auth.ACTIVATE_TFA, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            type: type
        })
    })
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(activateTfa, 0, type);
    if (res.ok) {
        let resJson = await res.json();
        return (resJson);
    }
    if (res.status == 400)
    {
        let resJson = await res.json();

        if (resJson.message == "user's email not verified")
            NOTIFICATION.simple({title: "TFA", body: "You need to verify your email!"});
        Router();
    }
    return ({})
}

export async function getEmailCode(recursionProtection, token) {
    let header = {};
    if (token == undefined) {
        header = {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    }
    const res = await fetch(`${URL.auth.GET_EMAIL_CODE}${token != undefined ? `?token=${token}` : ""}`, {
        credentials: "include",
        headers: header
    })
    if (token == undefined && res.status == 401 && recursionProtection)
        return await refreshAndRetry(getEmailCode, 0, token);
    if (res.status == 429)
    {
        let resJson = await res.json();
        let errMsg = resJson.detail.split(" ")
        NOTIFICATION.simple({title: "TFA", body:`You made too many request you will be able to request another code in ${errMsg[errMsg.length - 2]} seconds`})
    }
    return (res);

}

export async function validateCode(recursionProtection, code)
{
    const res = await fetch(URL.auth.VALIDATE_CODE, {
        method: "POST",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            code: code,
        })
    })
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(validateCode, 0, code);
    if (res.ok)
    {
        let jsonBody = await res.json();
        let body = "";

        for (let el of jsonBody.codes)
            body += ` ${el}`;
        document.querySelector(".downloadKeys").style.backgroundColor = "var(--bs-success)"
        document.querySelector(".downloadKeys").addEventListener("click", ()=>{
            window.downloadFile("recovery_keys.txt", body);
            document.querySelector(".finishBtn").disabled = false
            document.querySelector(".finishBtn").style.backgroundColor = "var(--bs-success)"
        })
        return (jsonBody);
    }
    return ({});
}

export async function validateCodeLogin(recursionProtection, code, token)
{
    const res = await fetch(`${URL.auth.VALIDATE_CODE_LOGIN}?token=${token}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            code: code,
        })
    })
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(validateCodeLogin, 0, code, token);
    if (res.status == 400)
    {
        let jsonBody = await res.json();
        localStorage.setItem("otp_token", jsonBody.token == undefined ? localStorage.getItem("otp_token") : jsonBody.token);
        return ({});
    }
    if (res.ok)
    {
        let jsonBody = await res.json();
        return (jsonBody);
    }
    return ({});
}

export async function isTfaACtive(recursionProtection)
{
    const res = await fetch(URL.auth.CHECK_TFA_STATUS, {
        method: "GET",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    if (res.ok)
    {
        let resJson = await res.json();
        if (resJson.is_active)
        {
            localStorage.setItem("is_active", resJson.type);
        }
        else
            localStorage.removeItem("is_active");
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(isTfaACtive, 0);
}

export async function validateRecover(token, code)
{
    const res = await fetch(`${URL.auth.VALIDATE_CODE_RECOVERY}?token=${token}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            code: code,
        })
    })
    if (res.status == 400)
    {
        let jsonBody = await res.json();
        localStorage.setItem("otp_token", jsonBody.token == undefined ? localStorage.getItem("otp_token") : jsonBody.token);
        return ({});
    }
    if (res.ok)
    {
        let jsonBody = await res.json();
        return (jsonBody);
    }
    return ({});
} 

export async function removeTfa(recursionProtection, code)
{
    const res = await fetch(URL.auth.REMOVE_TFA, {
        method: "PUT",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            code: code
        })
    })
    if (res.ok)
    {
        localStorage.removeItem("is_active");
        history.pushState(null, null, "/account/");
        Router();
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(removeTfa, 0, code);
    return (res);
}

export async function sendRecoveryEmail(username)
{
    const res = await fetch(URL.auth.SEND_RECOVERY_CODE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
        })
    })
    try{
        let temp = await res.json();
        return (temp);
    }catch(e){
        return ({})
    }
}

export async function recoveryPassword(data, token)
{
    const res = await fetch(`${URL.auth.UPDATE_PASSWORD}?token=${token}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    if (res.ok)
    {
        history.pushState(null, null, "/login/");
        Router();   
    }
}

export async function getIntraStatus(recursionProtection){
    const res = await fetch(URL.auth.INTRA_STATUS, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        let body = await res.json();
        return (body);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(getIntraStatus, 0);
    return ({});
}

export async function getGoogleUrl() {
    const res = await fetch(`${URL.auth.GET_GOOGLE_URL}`, {
        credentials: "include",
        method: "GET",
    });
    if (res.ok) {
        let temp = await res.json();
        return (temp.url);
    }
    return ("");
}

export async function linkGoogleAccount(recursionProtection, code, state) {
    const res = await fetch(URL.auth.LINK_GOOGLE_ACCOUNT, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            code: code,
            state: state
        })
    });
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(linkGoogleAccount, 0, code, state);
}

export async function googleLogin(recursionProtection, code, state) {
    const res = await fetch(URL.auth.LOGIN_WITH_GOOGLE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            code: code,
            state: state
        })
    });
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(googleLogin, 0, code, state);
    if (res.ok)
    {
        let jsonBody = await res.json();

        localStorage.setItem("token", jsonBody.access_token)
        localStorage.setItem("username", jsonBody.username)
    }
}

export async function removeFriend(recursionProtection, username){
    const res = await fetch(`${URL.friendship.REMOVE_FRIEND}?username=${username}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        document.querySelector(".chatSideList").innerHTML = ""; 
        create.createUser(create.global, "connected");
        getFriends(1).then(users=>{
            for (let i = 0; i < users.length; i++)
                create.createUser(users[i], users[i].status);
        })
        alert("friend removed")
        return;
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(removeFriend, 0, username);
    alert("error ha occured..")
}

export async function sendFriendRequest(recursionProtection, username){
    const res = await fetch(`${URL.friendship.SEND_REQUEST}?username=${username}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        alert("request sent!")
        return {};
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(sendFriendRequest, 0, username);
    alert("error ha occured..")
    let parsed = await res.json();
    return parsed;
}

export async function friendStatus(recursionProtection, username){
    const res = await fetch(`${URL.friendship.FRIEND_STATUS}?username=${username}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(friendStatus, 0, username);
    return ({})
}

export async function acceptRequest(recursionProtection, token){
    const res = await fetch(`${URL.friendship.ACCEPT_REQUEST}?token=${token}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        document.querySelector(".chatSideList").innerHTML = ""; 
        create.createUser(create.global, "connected");
        getFriends(1).then(users=>{
            for (let i = 0; i < users.length; i++)
                create.createUser(users[i], users[i].status);
        })
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(acceptRequest, 0, token);
    alert("error ha occured..")
    return ({})
}
export async function denyRequest(recursionProtection, token){
    const res = await fetch(`${URL.friendship.DENY_REQUEST}?token=${token}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(denyRequest, 0, token);
    alert("error ha occured..")
    return ({})
}
export async function getFriends(recursionProtection){
    const res = await fetch(URL.friendship.GET_FRIENDS, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        let parsed = await res.json();
        help.chatInitializer(parsed);
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(getFriends, 0);
    return ({})
}

export async function getUsers(recursionProtection){
    const res = await fetch(URL.general.GET_USERS, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(getUsers, 0);
    return ({})
}

export async function getDummyUsers(recursionProtection, pageSize, pageNumber){
    const res = await fetch(`http://localhost:3000/objects?page=${pageNumber}&size=${pageSize}`, {
        method: "GET",
    });
    if (res.ok) {
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(getUsers, 0);
    alert("error ha occured..")
    return ({})
}


export async function getTicket(recursionProtection, url){
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(getTicket, 0, url);
    return ({})
}
export async function startQueque(recursionProtection){
    const res = await fetch(URL.socket.GET_QUEQUE_TICKET, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(startQueque, 0);
    return ({})
}

export async function adminGetUsers(recursionProtection, page, size){
    const res = await fetch(`${URL.general.GET_USERS}?page=${page}&size=${size}&role=U`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(adminGetUsers, 0, page, size);
    return ({})
}
export async function adminGetBannedUsers(recursionProtection, page, size){
    const res = await fetch(`${URL.general.GET_USERS}?search=False&page=${page}&size=${size}&active=false`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(adminGetBannedUsers, 0, page, size);
    return ({})
}
export async function adminGetModerator(recursionProtection, page, size){
    const res = await fetch(`${URL.general.GET_USERS}?search=M&page=${page}&size=${size}&role=M
    `, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(adminGetModerator, 0, page, size);
    return ({})
}
export async function removeUser(recursionProtection, username){
    const res = await fetch(`${URL.manageUsers.DELETE_USER}${username}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        alert(`user ${username} has been removed!`);
        return ;
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(removeUser, 0, username);
    alert("error ha occured..")
    return ({})
}
export async function manageUserBan(recursionProtection, username, banState){
    const res = await fetch(`${URL.manageUsers.MANAGE_BAN}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            banned: banState
        }),
        credentials: "include",
    });
    if (res.ok) {
        //alert(banState ? `${username} has been banned!` : `${username} is no longer banned!`);
        return ;
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(manageUserBan, 0, username, banState);
    alert("error ha occured..")
    return ({})
}
export async function manageModerator(recursionProtection, username, moderatorState){
    const res = await fetch(`${URL.manageUsers.MANAGE_MODERATOR}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            role: moderatorState
        }),
        credentials: "include",
    });
    if (res.ok) {
        //alert(moderatorState == "M" ? `${username} is now a moderator!` : `${username} is no more a moderator!`);
        return ;
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(manageModerator, 0, username, moderatorState);
    alert("error ha occured..")
    return ({})
}

//still dummy call need to be implemente with real backEnd

export async function getTournamentsList(recursionProtection, page, size, options){
    let url = `${URL.tournaments.GET_TOURNAMENTS_LIST}?page=${page}&size=${size}${options.title}${options.participants}&finished=False`
    
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // credentials: "include",
    });
    if (res.ok) {
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(getTournamentsList, 0, page, size);
    return ([])
}

export async function tournamentSubmit(recursionProtection, displayName, id){
    const res = await fetch(URL.tournaments.REGISTER, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            display_name: displayName,
            tournament_id: Number(id)
        }),
        credentials: "include",

    });
    if (res.ok) {
        return (true);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(tournamentSubmit, 0, displayName, id);
    return (false)
}
export async function unsubscribeTournament(recursionProtection, tournamentId){
    const res = await fetch(URL.tournaments.UNREGISTER, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tournament_id: tournamentId,
        }),
        credentials: "include",

    });
    if (res.ok) {
        return (true);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(unsubscribeTournament, 0, tournamentId);
    return (false)
}

export async function createTournament(recursionProtection, form){
    const res = await fetch(URL.tournaments.CREATE, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: form.tName,
            display_name: form.tDisplayName,
            description: form.tDescription,
            participants: form.tPartecipants,
            start_date: form.tDateTime,
        }),
        credentials: "include",

    });
    if (res.ok) {
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(createTournament, 0, form);
    return ([])
}

export async function validateEmail(token){
    const res = await fetch(`${URL.auth.VALIDATE_EMAIL}?token=${token}`, {
        method: "GET",
    });
    if (res.ok) {
        return (true);
    }
    return (false)
}
export async function getMatchHistory(recursionProtection, username){
    const res = await fetch(`${URL.tournaments.GET_MATCH_HISTORY}?username=${username}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        credentials: "include",

    });
    if (res.ok){
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(getMatchHistory, 0, username);
    return ([])
}
export async function getTournamentInfo(recursionProtection, tournamentId){
    const res = await fetch(`${URL.tournaments.GET_TOURNAMENT_HISTORY}${tournamentId}/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        credentials: "include",
    });
    if (res.ok){
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(getTournamentInfo, 0, tournamentId);
    return ([])
}

export async function sendMatchReq(recursionProtection, username){
    const res = await fetch(URL.matchReq.SEND_REQUEST, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            requested: username,
        }),
        credentials: "include",

    });
    if (res.ok) {
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(sendMatchReq, 0, username);
    return ({})
}
export async function deleteMatchReq(recursionProtection){
    const res = await fetch(URL.matchReq.DELETE_REQUEST, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",

    });
    if (res.ok) {
        return (true);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(deleteMatchReq, 0);
    return (false)
}
export async function acceptMatchReq(recursionProtection, token){
    const res = await fetch(URL.matchReq.ACCEPT_REQUEST, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: token,
        }),
        credentials: "include",

    });
    if (res.ok) {
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(acceptMatchReq, 0, token);
    return ({})
}
export async function rejectMatchReq(recursionProtection, token){
    const res = await fetch(URL.matchReq.REJECT_REQUEST, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: token,
        }),
        credentials: "include",

    });
    if (res.ok) {
        return (true);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(rejectMatchReq, 0, token);
    return (false)
}

export async function getChatHistory(recursionProtection){
    const res = await fetch(URL.socket.GET_CHAT_HISTORY, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok){
        let parsed = await res.json();
        return (parsed);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(getChatHistory, 0);
    return ({})
}

export async function getPongMaestry(recursionProtection, username){
    const res = await fetch(`${URL.stats.RADAR_CHART}?username=${username}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok){
        let parsed = await res.json();
        return parsed;
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(getPongMaestry, 0, username);
    return ({});
}

export async function getDonutChart(recursionProtection, username, tournament){
    const res = await fetch(`${URL.stats.PIE_STATS}?username=${username}${tournament}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok){
        let parsed = await res.json();
        return parsed;
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(getDonutChart, 0, username, tournament);
    return ({});
}

export async function getIstogram(recursionProtection, username){
    const res = await fetch(`${URL.stats.ISTOGRAM_CHART}?username=${username}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok){
        let parsed = await res.json();
        return parsed;
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(getIstogram, 0, username);
    return ({});
}

//end of Dummy call