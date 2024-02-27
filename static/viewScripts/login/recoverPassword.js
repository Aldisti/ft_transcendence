import * as API from "/API/APICall.js"
import Router from "/router/mainRouterFunc.js";
import allLanguage from "/language/language.js"

let language = allLanguage[localStorage.getItem("language")];

export let emailError = `
    <ul style="margin: 0;">
        <li>${language.update.emailSuggest[0]}</li>
        <li>${language.update.emailSuggest[1]}</li>
        <li>${language.update.emailSuggest[2]}</li>
    </ul>
`
export let qrError = `
    <ul style="margin: 0;">
        <li>${language.update.qrSuggest[0]}</li>
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
                history.pushState(null, null, `/password/reset/?token=${res.token}`);
                Router();
            }
        }).catch(e=>{
            console.log(e)
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
            document.querySelector("#app").innerHTML = disableTfaPage(res.type);
            if (res.type == "EM")
            {
                API.getEmailCode(1, res.token).catch(e=>{
                    console.log(e)
                });
                document.querySelector(".resendBtn").addEventListener("click", ()=>{
                    API.getEmailCode(1, res.token).catch(e=>{
                        console.log(e)
                    });
                })
            }
            document.querySelector(".sendCode").addEventListener("click", ()=>{
                validateCodeRecovery(res.token);
            })
        }
    }).catch(e=>{
        console.log(e)
    })
}