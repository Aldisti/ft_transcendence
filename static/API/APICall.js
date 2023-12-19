import * as URL from "/API/URL.js"

export async function checkForUsernameAvailability(username){
    const res = await fetch(URL.availabilityCheck.USERNAME, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username: username}),
    })
    return res;
}

export async function checkForEmailAvailability(email){
    const res = await fetch(URL.availabilityCheck.EMAIL, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email: email}),
    })
    return res;
}

export async function login(data)
{
    const rest = fetch(URL.userAction.LOGIN, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })

}

export async function register(data)
{
    const rest = await fetch(URL.userAction.REGISTER, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })

    let body = await rest.json()
    return (body);
}

export async function updateInfo(data)
{
    const rest = await fetch(URL.userAction.UPDATE_INFO, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })

    let body = await rest.json()
    return (body);
}

export async function updatePassword(data)
{
    const rest = await fetch(URL.userAction.UPDATE_PASSWORD, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
	return (rest);
}


export async function updateEmail(data)
{
    const rest = await fetch(URL.userAction.UPDATE_EMAIL, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
	return (rest);
}