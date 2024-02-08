import * as API from "/API/APICall.js"
import Router from "/router/mainRouterFunc.js";


function validateLoginCode()
{
    let code = document.querySelector("#emailTfaCode").value;

    if (code.length == 6 || code.length == 10)
    {
        API.validateCodeLogin(1, code, localStorage.getItem("otp_token")).then(token=>{
            if (Object.keys(token).length  > 0)
            {
                localStorage.setItem("token", token.access_token)
                history.pushState(null, null, "/home/");
                Router();
            }
        })
    }
}

export function normal(res){
    localStorage.setItem("token", res.access_token)
    history.pushState(null, null, "/home/");
    Router();
}

export function Tfa(dupThis, res){
    if (res.type == "EM")
    {
        document.querySelector(".loginForm").innerHTML = dupThis.getTfaForm();
        document.querySelector(".resendBtn").addEventListener("click", ()=>{
            API.getEmailCode(1, res.token)
        })
        API.getEmailCode(1, res.token).then(res=>{
            document.querySelector(".sendCode").addEventListener("click", ()=>{
                if (res.ok)
                    validateLoginCode();
            })
        })
    }
    if (res.type == "SW")
        document.querySelector(".loginForm").innerHTML = dupThis.getTfaForm();
        document.querySelector(".sendCode").addEventListener("click", ()=>{
                validateLoginCode();
    })
}