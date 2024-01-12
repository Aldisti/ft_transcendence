import Aview from "/views/abstractView.js";
import language from "/language/language.js";
import * as API from "/API/APICall.js"
import sha256 from "/scripts/crypto.js"
import Router from "/router/mainRouterFunc.js";


function validateLoginCode()
{
    let code = document.querySelector("#emailTfaCode").value;
    console.log(code)
    if (code.length == 6 || code.length == 10)
    {
        API.validateCodeLogin(1, code, localStorage.getItem("otp_token")).then(token=>{
            console.log(token);
            if (Object.keys(token).length  > 0)
            {
                localStorage.setItem("token", token.access_token)
                history.pushState(null, null, "/home");
                Router();
                window.location.reload();
            }
        })
    }
}

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


window.showRecoveryPage = ()=>{
    document.querySelector("#app").innerHTML = `
        <div class="passwordPage">
            <div class="passwordContainer">
                <div class="line">
                    <h1 style="margin: 0;">Recover Your Password</h1>
                </div>
                <div class="line">
                    <h3>Enter username:</h3>
                    <div class="passInp">
                        <input type="text" class="data retroShade" name="username">
                    </div>
                </div>
                <div class=" btnLeft">
                    <button id="recoveryBtn" class="retroBtn retroShade btnColor-green">Get Email</button>
                </div>
            </div>
        </div>
    `
    document.querySelector("#recoveryBtn").addEventListener("click", ()=>{
        API.sendRecoveryEmail(document.querySelector(".data").value).then(res=>{
            if (Object.keys(res).length > 0)
            {
                console.log(res)
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
    })
}

let emailError = `
    <ul style="margin: 0;">
        <li>An Email has been sent Check you Inbox!</li>
        <li>insert the Code in the box below</li>
        <li>Submit and activate your 2FA</li>
    </ul>
`
let qrError = `
    <ul style="margin: 0;">
        <li>Open your app and look for your code</li>
        <li>insert it in the box below</li>
        <li>submit and login</li>
    </ul>
`

export default class extends Aview {
    constructor() {
        super();
        this.needListener = true;
        this.listenerId = "loginBtn";
        this.field = {};
    }
    getHtml() {
        return `
		<div class="base">
        	<div class="loginForm">
            	<h1 id="title">${this.language.login.login}</h1>
            	<div class="line">
                	<h4>${language.en.login.name}</h4>
                	<input type="text" class="data retroShade" name="username">
            	</div>
            	<div class="line">
                	<h4>${this.language.login.password}</h4>
					<div class="passInp">
						<input size="small" type="password" class="data retroShade" name="password">
                    	<div onclick="window.switchVisibility(this)" class="passwordSwitch">
                    	    <img src="/imgs/openEye.png" alt="">
                    	</div>
                	</div>
            	</div>
                <div class="loginError">
                    <p>
                        ${this.language.login.error}
                    </p>
                </div>
            	<div class="linebtn">
                	<a class="retroBtn retroShade btnColor-yellow" href="/signup" data-link>${this.language.login.register}</a>
                	<a class="retroBtn intraBtn retroShade btnColor-blue" href="#">${this.language.login.intraLogin}</a>
                	<button id="loginBtn" class="retroBtn retroShade btnColor-green">${this.language.login.submit}</button>
            	</div>
                <span onclick="window.showRecoveryPage()"  class="recovery" href="#">Password Dimenticata?</span>
        	</div>
   		</div>
        `
    }

    get2faEmailForm(){
        return `
        <div class="formContainer" style="color: black !important;">
        <div class="line infoLine">
            <div>
                ${localStorage.getItem("is_active") == "EM" ? emailError : qrError}
            </div>
        </div>
        <div class="line codeInputLine">
            <label for="emailTfaCode">Insert Code:</label>
            <input id="emailTfaCode" type="text">
        </div>
        <div class="line" style="flex-direction: row;">
            <button class="retroBtn resendBtn" style="background-color: var(--bs-warning)">send email</button>
            <button class="retroBtn sendCode" style="background-color: var(--bs-success)">Submit</button>
        </div>
    </div>
        `
    }
    setup() {
        API.convertIntraToken().then(res=>{
            if (!res)
            {
                API.getIntraUrl("login").then((url) => {
                    document.querySelector(".intraBtn").href = url;
                })
                window.addEventListener("click", (e) => {
                    if (e.target.id == "loginBtn") {
                        this.updateField(this.getInput());
                        this.field.password = sha256(this.field.password)
                            // this.field.password = this.field.password //for testing
                        API.login(this.field).then(res=>{
                            console.log(res, Object.keys(res).length)
                            if (Object.keys(res).length == 1)
                            {
                                localStorage.setItem("token", res.access_token)
                                history.pushState(null, null, "/home");
                                Router();
                                window.location.reload();
                            }
                            else if (Object.keys(res).length > 1)
                            {
                                if (res.type == "EM")
                                {
                                    document.querySelector(".loginForm").innerHTML = this.get2faEmailForm();
                                    document.querySelector(".resendBtn").addEventListener("click", ()=>{
                                        API.getEmailCode(1, res.token)
                                    })
                                    API.getEmailCode(1, res.token).then(res=>{
                                        document.querySelector(".sendCode").addEventListener("click", ()=>{
                                            if (res.ok)
                                                validateLoginCode();
                                        })
                                    })
                                    // document.querySelector("#app").innerHTML = this.get2faAppForm();
                                }
                                if (res.type == "SW")
                                    document.querySelector(".loginForm").innerHTML = this.get2faEmailForm();
                                    document.querySelector(".sendCode").addEventListener("click", ()=>{
                                            validateLoginCode();
                                    })
                            }

                        })
                    }
                })
                if (localStorage.getItem("style") == "modern")
                    document.querySelector("#app").style.backgroundImage = "url('https://c4.wallpaperflare.com/wallpaper/105/526/545/blur-gaussian-gradient-multicolor-wallpaper-preview.jpg')";
                else
                    document.querySelector("#app").style.backgroundImage = "url('/imgs/backLogin.png')";
                document.querySelector("#app").style.backgroundSize = "cover"
                document.querySelector("#app").style.backgroundRepeat = "repeat"
            }

        })
    }

}