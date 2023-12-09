export async function checkUser(username){
    const res = await fetch("http://localhost:4200/username/check", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username: username}),
    })
    if (res.ok)
        return (true);
    return false;
}

export async function checkEmail(email){
    const res = await fetch("http://localhost:4200/email/check", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email: email}),
    })
    if (res.ok)
        return (true);
    return false;
}