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

export async function getUserInfo(recursionProtection) {
    const res = await fetch(`${URL.general.USER_INFO}`, {
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
        return (jsonBody.results[0].user_info);
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
    if (res.status == 201) {
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
        method: "PUT",
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

export async function updatePassword(recursionProtection, data) {
    const rest = await fetch(URL.userAction.UPDATE_PASSWORD, {
        method: "POST",
        credentials: "include",
        headers: {
            Autorization: `Bearer ${localStorage.getItem("token")}`,
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
        })
    }
    if (res.ok)
    {
        window.location.reload();
    }
}