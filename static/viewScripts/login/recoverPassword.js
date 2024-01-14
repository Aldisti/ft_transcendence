import * as API from "/API/APICall.js"
import Router from "/router/mainRouterFunc.js";

export let emailError = `
    <ul style="margin: 0;">
        <li>An Email has been sent Check you Inbox!</li>
        <li>insert the Code in the box below</li>
        <li>Submit and activate your 2FA</li>
    </ul>
`
export let qrError = `
    <ul style="margin: 0;">
        <li>Open your app and look for your code</li>
        <li>insert it in the box below</li>
        <li>submit and login</li>
    </ul>
`

function validateCodeRecovery(token)
{
    let code = document.querySelector("#TfaCode").value;
    if (code.length == 6 || code.length == 10)
    {
        API.validateRecover(token, code).then(res=>{
            if (Object.keys(res).length == 1)
            {
                history.pushState(null, null, `/password/recovery/?token=${res.token}`);
                Router();
            }
        });
    }
}

function disableTfaPage(type){
    return `
        <div class="base">
            <div class="loginForm">
                <div class="formContainer" style="color: black !important;">
                    <div class="line infoLine">
                        <div>
                            ${localStorage.getItem("is_active") == "EM" ? emailError : qrError}
                        </div>
                    </div>
                    <div class="line codeInputLine">
                        <label for="emailTfaCode">Insert Code:</label>
                        <input id="TfaCode" type="text">
                    </div>
                    <div class="line" style="flex-direction: row;">
                        ${type == "EM" ? `<button class="retroBtn resendBtn" style="background-color: var(--bs-warning)">send email</button>` : ""}
                        <button class="retroBtn sendCode" style="background-color: var(--bs-success)">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    `
}

export function start()
{
    API.sendRecoveryEmail(document.querySelector(".data").value).then(res=>{
        if (Object.keys(res).length > 0)
        {
            //console.log(res)
            document.querySelector("#app").innerHTML = disableTfaPage(res.type);
            if (res.type == "EM")
            {
                API.getEmailCode(1, res.token);
                document.querySelector(".resendBtn").addEventListener("click", ()=>{
                    API.getEmailCode(1, res.token);
                })
            }
            document.querySelector(".sendCode").addEventListener("click", ()=>{
                validateCodeRecovery(res.token);
            })
        }
    })
}