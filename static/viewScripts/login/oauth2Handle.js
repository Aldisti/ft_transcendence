import * as API from "/API/APICall.js"
import Router from "/router/mainRouterFunc.js"

export function intraLoginHandle(){
    document.querySelector(".intraBtn").addEventListener("click", ()=>{
        API.getIntraUrl("login").then((url) => {
            localStorage.setItem("intraLogin", "true");
            window.location.href = url;
        }).catch(e=>{
            console.log(e)
        })
    })
}

export function googleLoginHandle(){
    document.querySelector(".googleBtn").addEventListener("click", ()=>{
        API.getGoogleUrl().then((url) => {
            localStorage.setItem("loginWithGoogle", "true");
            window.location.href = url;
        }).catch(e=>{
            console.log(e)
        })
    })
}