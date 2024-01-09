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

export async function checkForEmailAvailability(email) {
    const res = await fetch(`${URL.availabilityCheck.EMAIL}?search=${email}`, {
        method: "GET",
    })
    let temp = await res.json()
    if (temp.count == 0)
        return (true);
    return (false)
}

export async function getUserInfo(recursionProtection) {
    const res = await fetch(`${URL.general.USER_INFO}?search=${localStorage.getItem("username")}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("username")}`
        },
        credentials: "include",
    })
    if (res.status == 401 && recursionProtection) {
        refreshToken().then(res => {
            if (res.ok) {
                getUserInfo(0);
                return;
            } else {
                history.pushState(null, null, "/home");
                Router();
                window.location.reload();
            }
        })
    }
    if (res.ok) {
        let jsonBody = await res.json();
        console.log(jsonBody)
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
    if (res.ok) {
        localStorage.setItem("username", data.username);
        history.pushState(null, null, "/home");
        Router();
        window.location.reload();
    }
    let token = await res.json();
    localStorage.setItem("token", token.access_token)
}

export async function refreshToken() {
    const res = await fetch(URL.userAction.REFRESH_TOKEN, {
        method: "POST",
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

export async function updateInfo(data, recursionProtection) {
    const res = await fetch(URL.userAction.UPDATE_INFO, {
        method: "POST",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    if (res.ok) {
        history.pushState(null, null, "/home");
        Router();
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
            if (res.ok)
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