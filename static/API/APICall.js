import Router from "/router/mainRouterFunc.js"
import * as URL from "/API/URL.js"

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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
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
    if (res.status == 401 && recursionProtection) {
        refreshToken().then(res=>{
            if (res.ok)
                convertIntraTokenAccount(0);
        })
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
    if (res.status == 401 && recursionProtection) {
        refreshToken().then(res => {
            if (res.ok) {
                getUserInfo(0);
            } else {
                history.pushState(null, null, "/home");
                Router();
                window.location.reload();
            }
        })
    }
    if (res.ok) {
        let jsonBody = await res.json();
        return (jsonBody.user_info);
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
    if (res.status == 401 && recursionProtection) {
        refreshToken().then(res => {
            if (res.ok)
                updateInfo(data, 0);
        })
    }
    let body = await res.json()
    return (body);
}

export async function updatePassword(recursionProtection, data) {
    const res = await fetch(URL.userAction.UPDATE_PASSWORD, {
        method: "PATCH",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    if (res.status == 401 && recursionProtection) {
        refreshToken().then(res => {
            if (res.ok)
                updatePassword(0, data);
        })
        return;
    }
    if (res.status == 400)
    {
        alert("Old password is not correct...")
    }
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
    if (res.status == 401 && recursionProtection) {
        refreshToken().then(res => {
            if (res.ok)login
                logout(0);
        })
        return;
    }
    if (res.ok) {
        localStorage.removeItem("username");
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
        method: "GET",
    });
    if (res.ok) {
        let temp = await res.json();
        return (temp.url);
    }
    return ("");
}

export async function uploadImage(recursionProtection, file){
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
    {
        refreshToken().then(res=>{
            if (res.ok)
                uploadImage(0, file);
            else
            {
                localStorage.removeItem("username");
                history.pushState(null, null, "/login");
                Router();
                window.location.reload();
            }
        })
    }
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
    {
        refreshToken().then(res=>{
            if (res.ok)
                activateTfa(0, type);
            else
            {
                localStorage.removeItem("username");
                history.pushState(null, null, "/login");
                Router();
                window.location.reload();             
            }
        })
    }
    if (res.ok)
    {
        let resJson = await res.json();
        console.log(resJson)
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
    {
        refreshToken().then(res=>{
            if (res.ok)
                getEmailCode(0);
            else
            {
                localStorage.removeItem("username");
                history.pushState(null, null, "/login");
                Router();
                window.location.reload();             
            }
        })
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
    {
        refreshToken().then(res=>{
            if (res.ok)
                validateCode(0, code);
            else
            {
                localStorage.removeItem("username");
                history.pushState(null, null, "/login");
                Router();
                window.location.reload();             
            }
        })
    }
    if (res.ok)
    {
        let jsonBody = await res.json();
        console.log(jsonBody)
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
    {
        refreshToken().then(res=>{
            if (res.ok)
                validateCodeLogin(0, code, token);
            else
            {
                localStorage.removeItem("username");
                history.pushState(null, null, "/login");
                Router();
                window.location.reload();             
            }
        })
    }
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
        return (resJson)
    }
    if (res.status == 401 && recursionProtection)
    {
        refreshToken().then(res=>{
            if (res.ok)
                isTfaACtive(0);
            else
            {
                localStorage.removeItem("username");
                history.pushState(null, null, "/login");
                Router();
                window.location.reload();             
            }
        })
    }
}

export async function removeTfa(recursionProtection, code)
{
    const res = await fetch(URL.auth.REMOVE_TFA, {
        method: "DELETE",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            code: code
        })
    })
    if (res.status == 401 && recursionProtection)
    {
        refreshToken().then(res=>{
            if (res.ok)
                removeTfa(0);
            else
            {
                localStorage.removeItem("username");
                history.pushState(null, null, "/login");
                Router();
                window.location.reload();             
            }
        })
    }
    console.log(res);
    return (res);
}