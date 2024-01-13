import Router from "/router/mainRouterFunc.js"
import * as URL from "/API/URL.js"

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function refreshAndRetry(retryFunc, ...args)
{
    await refreshToken().then(res=>{
        if (!res.ok)
        {
            localStorage.removeItem("username");
            history.pushState(null, null, "/login");
            Router();
            window.location.reload();
        }
    })
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

export async function convertIntraToken(){
    if (getCookie("api_token") == undefined)
        return (false);

    const res = await fetch(URL.general.CONVERT_INTRA_TOKEN, {
        method: "POST",
        credentials: "include",
    });
    if (res.ok) {
        let token = await res.json();
        localStorage.setItem("token", token.access_token)
        localStorage.setItem("username", token.username);
        history.pushState(null, null, "/home");
        Router();
        window.location.reload();
        return (true);
    }
    return (false);
}
export async function convertIntraTokenAccount(recursionProtection){
    if (getCookie("api_token") == undefined)
        return (false);
    const res = await fetch(URL.general.LINK_INTRA_TOKEN_ACCOUNT, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        let token = await res.json();
        localStorage.setItem("token", token.access_token)
        localStorage.setItem("username", token.username);
        history.pushState(null, null, "/home");
        Router();
        window.location.reload();
        return (true);
    }
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(convertIntraTokenAccount, 0);
    return (false);
}

export async function unlinkIntra(recursionProtection){
    const res = await fetch(URL.general.LINK_INTRA_TOKEN_ACCOUNT, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });
    if (res.ok) {
        // history.pushState(null, null, "/home");
        // Router();
        // window.location.reload();
        return (true);
    }
    if (res.status == 401 && recursionProtection) {
        return await refreshAndRetry(unlinkIntra, 0);
    }
    return (false);
}

export async function getUserInfo(recursionProtection) {
    const res = await fetch(`${URL.general.USER_INFO}${localStorage.getItem("username")}/`, {
        method: "GET",
        headers: {
            // Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        // credentials: "include",
    })
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(getUserInfo, 0);
    if (res.ok) {
        let jsonBody = await res.json();
        return (jsonBody);
    }
    return ({});
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
    if (!res.ok)
    {
        document.querySelector(".loginError").style.display = "flex";
    }
    if (res.ok)
    {
        localStorage.setItem("username", data.username);
        let token = await res.json();
        localStorage.setItem("otp_token", token.token);
        return (token)
    }
}

export async function refreshToken() {
    const res = await fetch(URL.userAction.REFRESH_TOKEN, {
        method: "GET",
        credentials: 'include',
    })
    if (!res.ok) {
        history.pushState(null, null, "/login");
        Router();
        window.location.reload();
    }
    let token = await res.json();
    localStorage.setItem("token", token.access_token);
    return (res);
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
        console.log("hey")
        localStorage.setItem("username", data.username)
        history.pushState(null, null, "/login");
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
        window.location.reload();
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
    if (!res.ok)
    {
        document.querySelector(`#${dupThis.language.update.oldPassword[1]}-tooltip`).innerHTML = dupThis.language.update.passwordErrors[0];
        document.querySelectorAll("input")[0].style.backgroundColor = "#A22C29";
        document.querySelectorAll("input")[0].style.color = "white"
    }
    if (res.status == 400)
    {
        alert("Old password is not correct...")
    }
    if (res.ok)
        window.location.reload()
    return (res);
}


export async function updateEmail(data) {
    const rest = await fetch(URL.userAction.UPDATE_EMAIL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    return (rest);
}

export async function logout(recursionProtection) {
    const res = await fetch(URL.userAction.LOGOUT, {
        method: "GET",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
    });
    if (res.status == 401 && recursionProtection)
        return await refreshAndRetry(logout, 0);
    if (res.ok) {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("intraLinked");
        localStorage.removeItem("isActive");
        localStorage.removeItem("selectedForm");
        history.pushState(null, null, "/home");
        Router();
        window.location.reload();
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

export async function uploadImage(recursionProtection, file){
    console.log("hey")
    const form = new FormData();

    if (file.files.length > 0){
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
    if (res.ok)
    {
        window.location.reload();
    }
}


export async function activateTfa(recursionProtection, type)
{
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
    if (res.ok)
    {
        let resJson = await res.json();
        return (resJson);
    }
    return ({})
}

export async function getEmailCode(recursionProtection, token)
{
    let header = {};
    if (token == undefined)
    {
        header =  {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    }
    const res = await fetch(`${URL.auth.GET_EMAIL_CODE}${token != undefined ? `?token=${token}` : ""}`, {
        credentials: "include",
        headers: header
    })
    if (token == undefined && res.status == 401 && recursionProtection)
        return await refreshAndRetry(activateTfa, 0, token);
    if (res.status == 429)
    {
        console.log(res.headers)
        let resJson = await res.json();
        let errMsg = resJson.detail.split(" ")
        alert(`You made too many request you will be able to request another code in ${errMsg[errMsg.length - 2]} seconds`)
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
        console.log(jsonBody);
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
        console.log(jsonBody);
        localStorage.setItem("otp_token", jsonBody.token == undefined ? localStorage.getItem("otp_token") : jsonBody.token);
        return ({});
    }
    if (res.ok)
    {
        let jsonBody = await res.json();
        console.log(jsonBody);
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
        console.log(jsonBody);
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
        history.pushState(null, null, "/home");
        Router();
        window.location.reload()
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
    console.log(res)
    let temp = await res.json();
    console.log(temp);
    return (temp);
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
        history.pushState(null, null, "/login");
        Router();
        window.location.reload();    
    }
    console.log(res)
}

export async function getIntraStatus(recursionProtection){
    console.log("hey")
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