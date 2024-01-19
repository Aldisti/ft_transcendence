import Aview from "/views/abstractView.js";
import language from "/language/language.js";
import * as API from "/API/APICall.js"
import sha256 from "/scripts/crypto.js"
import * as oauth2 from "/viewScripts/login/oauth2Handle.js";
import * as handleLogin from "/viewScripts/login/handleLogin.js";
import * as triggerRecovery from "/viewScripts/login/recoverPassword.js";

export default class extends Aview {
    constructor() {
        super();
        this.needListener = true;
        this.listenerId = "loginBtn";
        this.field = {};
    }

    showRecoveryPage(){
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
                    <button id="recoveryBtn" class="retroBtn retroShade btnColor-green importantSubmit">Get Email</button>
                </div>
            </div>
        </div>
        `
        document.querySelector("#recoveryBtn").addEventListener("click", triggerRecovery.start);
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
                    	<button id="loginBtn" class="retroBtn fullWidth importantSubmit retroShade btnColor-green">${this.language.login.submit}</button>
                    </div>
                    <div class="linebtn">
                    	<button class="retroBtn tfa intraBtn retroShade btnColor-blue"><img src="/imgs/logo42.png"><span>${this.language.login.intraLogin}</span></button>
                    	<button class="retroBtn tfa googleBtn retroShade btnColor-blue"><img src="/imgs/logoGoogle.png"><span>${this.language.login.googleLogin}</span></button>
                	</div>
                    <div class="extra">
                        <a class="retroShade registerLink" href="/signup/" data-link>${this.language.login.register}</a>
                        <span class="recovery" href="#">Password Dimenticata?</span>
                    </div>
            	</div>
   		    </div>
        `
    }

    getTfaForm(){
        return `
            <div class="formContainer" style="color: black !important;">
                <div class="line infoLine">
                    <div>
                        ${localStorage.getItem("is_active") == "EM" ? triggerRecovery.emailError : triggerRecovery.qrError}
                    </div>
                </div>
                <div class="line codeInputLine">
                    <label for="emailTfaCode">Insert Code:</label>
                    <input id="emailTfaCode" type="text">
                </div>
                <div class="line" style="flex-direction: row;">
                    <button class="retroBtn resendBtn" style="background-color: var(--bs-warning)">send email</button>
                    <button class="retroBtn sendCode" id="submit" style="background-color: var(--bs-success)">Submit</button>
                </div>
            </div>
        `
    }
    setup() {
        //do all the necessary stuff to manage the login with intra if user is already linked
        oauth2.intraLoginHandle();
        oauth2.googleLoginHandle();

        document.querySelector(".recovery").addEventListener("click", this.showRecoveryPage)

        //defining what to do in case of login button is pressed
        document.querySelector("#loginBtn").addEventListener("click", (e) => {
            this.updateField(this.getInput());
            this.field.password = sha256(this.field.password)

            //send username and password to the server to be validated
            API.login(this.field).then(res=>{
                //perform a normal login justi redirect to HOME and refresh the page
                if (Object.keys(res).length == 1)
                    handleLogin.normal(res);
                
                //perform a login with TFA on so the user is asked to insert verification code to be redirected
                else if (Object.keys(res).length > 1)
                    handleLogin.Tfa(this, res)
            })
        })
        this.defineWallpaper("/imgs/backLogin.png", "https://c4.wallpaperflare.com/wallpaper/105/526/545/blur-gaussian-gradient-multicolor-wallpaper-preview.jpg")
    }

}