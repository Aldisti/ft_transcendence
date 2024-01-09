import Router from "/router/mainRouterFunc.js"
import * as URL from "/API/URL.js"

export async function checkForUsernameAvailability(username) {
    const res = await fetch(`${URL.availabilityCheck.USERNAME}?search=${username}`, {
        method: "GET",
    })
    let temp = await res.json()
    if (temp.count == 0)
        return (true);
    return (false)
}

export async function refreshToken() {
    const res = fetch(API.REFRESH_TOKEN, {
        method: "POST",
        headers: {
            credentials: "include"
        }
    })
    if (!res.ok) {
        history.pushState(null, null, "/login");
        Router();
        window.location.reload();
    }
}

export async function checkForEmailAvailability(email) {
    const res = await fetch(`${URL.availabilityCheck.EMAIL}?search=${email}`, {
        method: "GET",
    })
    let temp = await res.json()
    if (temp.count == 0)
        return (true);
    return (false)
}

export async function login(data) {
    const res = await fetch(URL.userAction.LOGIN, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    if (res.ok) {
        localStorage.setItem("username", data.username);
        history.pushState(null, null, "/home");
        Router();
        window.location.reload();
    }
    let token = await res.json();
    window.getToken = window.setToken(token.access_token);
}

export async function refreshToken() {
    const res = await fetch(URL.userAction.REFRESH_TOKEN, {
        method: "POST",
        credentials: 'include',
    })
    let token = await res.json();
    window.getToken = window.setToken(token.access_token);
}

export async function register(data) {
    const rest = await fetch(URL.userAction.REGISTER, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    if (res.ok) {
        localStorage.setItem("username", data.username)
        history.pushState(null, null, "/home");
        Router();
        return ({});
    } else {
        let body = await rest.json()
        return (body);
    }
}

export async function updateInfo(data) {
    const rest = await fetch(URL.userAction.UPDATE_INFO, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })

    let body = await rest.json()
    return (body);
}

export async function updatePassword(data) {
    const rest = await fetch(URL.userAction.UPDATE_PASSWORD, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    return (rest);
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

export async function logout() {
    const res = await fetch(URL.userAction.LOGOUT, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${window}`
        }
    });
    if (res.status == 401) {
        refreshToken();
        logout();
    }
    if (res.ok) {
        localStorage.removeItem("username")
        return (true);
    }
    return (false);
}

export async function getIntraUrl() {
    const res = await fetch(URL.general.INTRA_URL, {
        method: "GET",
    });
    console.log(res)
    if (res.ok) {
        let temp = await res.json();
        return (temp.url);
    }
    return ("");
}