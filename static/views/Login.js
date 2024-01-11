import Aview from "/views/abstractView.js";
import language from "/language/language.js";
import * as API from "/API/APICall.js"
import sha256 from "/scripts/crypto.js"
import Router from "/router/mainRouterFunc.js"

function validateLoginCode()
{
    let code = document.querySelector("#emailTfaCode").value;
    console.log(code)
    if (code.length == 6)
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
        	</div>
   		</div>
        `
    }

    get2faAppForm(){
        return `
            <div class="formContainer">
                <div class="line qrLine">
                    <div id="qrCode">
                    </div>
                    <div class="qrInfo">
                        hey
                    </div>
                </div>
                <div class="line codeInputLine">
                    <input type="text">
                    <button class="retroBtn">Submit</button>
                </div>
                <div class="line submitLine">
                    <button onclick="window.showCode()" class="retroBtn">show code</button>
                    <p class="codeDisplay" style="display: none;">
                    heyyyjdfhkjbfsjkwfbgwkjfbgwkfsgbkjfbvfkjbvfkjbvksfjbvsfkjvbsbfkjvbksfjvbkjfbskj
                    </p>
                    
                </div>
            </div>
        `
    }
    get2faEmailForm(){
        return `
            <div class="formContainer">
                <div class="line infoLine">
                    <div>
                        <p class="info">
                        </p>
                    </div>
                    <button class="retroBtn sendBtn" style="background-color: var(--bs-success);">send email</button>
                </div>
                <div class="line codeInputLine">
                    <input id="emailTfaCode" type="text">
                    <button class="retroBtn sendCode" style="background-color: var(--bs-success);">Submit</button>
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
                                    document.querySelector(".base").innerHTML = this.get2faEmailForm();
                                    API.getEmailCode(1, res.token).then(res=>{
                                        document.querySelector(".sendCode").addEventListener("click", ()=>{
                                            if (res.ok)
                                                validateLoginCode();
                                        })
                                    })
                                    // document.querySelector("#app").innerHTML = this.get2faAppForm();
                                }
                                if (res.type == "SW")
                                    document.querySelector(".base").innerHTML = this.get2faEmailForm();
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