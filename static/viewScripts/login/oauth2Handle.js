import * as API from "/API/APICall.js"


export function intraLoginHandle(){
    if (localStorage.getItem("loginWithIntra") != null)
    {
        API.convertIntraToken(1).then(res=>{})
        localStorage.removeItem("loginWithIntra");
    }
    document.querySelector(".intraBtn").addEventListener("click", ()=>{
        API.getIntraUrl("login").then((url) => {
            localStorage.setItem("loginWithIntra", "true");
            window.location.href = url;
        })
    })
}