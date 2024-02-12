import Aview from "/views/abstractView.js";
import sha256 from "/scripts/crypto.js";
import * as API from "/API/APICall.js"
import Router from "/router/mainRouterFunc.js"
import allLanguage from "/language/language.js"

let language = allLanguage[localStorage.getItem("language")];

function passwordValidator(password)
{
    if (password.length > 8 && password.length < 72 && password.match(/[0123456789]/) && password.match(/[!@#$%^&*()_+\-=ˆ\[\]{};:'",.<>?~]/) && password.match(/[QWERTYUIOPASDFGHJKLZXCVBNM]/) && password.match(/[qwertyuiopasdfghjklzxcvbnm]/))
        return (true);
    return (false);
}  

export default class extends Aview {
    constructor() {
        super();
        this.needListener = true;
        this.listenerId = "loginBtn";
        this.field = {};
    }

    getHtml(){
        return `
        <div class="passwordPage">
            <div class="passwordContainer">
                <div class="line">
                <h3>${language.passwordRecovery.enterPassword}</h3>
                <div class="passInp">
                    <input size="small" type="password" class="data retroShade" name="password">
                    <div onclick="window.switchVisibility(this)" class="passwordSwitch">
                        <img src="/imgs/openEye.png" alt="">
                    </div>
                </div>
                </div>
                <div class="line">
                    <h3>${language.passwordRecovery.enterPassword}</h3>
                    <div class="passInp">
                        <input size="small" type="password" class="data retroShade" name="confirmPassword">
                        <div onclick="window.switchVisibility(this)" class="passwordSwitch">
                            <img src="/imgs/openEye.png" alt="">
                        </div>
                    </div>
                </div>
                <div class="errors retroShade" style="display: none;">
                    <ul>
                        <li>${language.register.errors[0]}</li>
                        <li>${language.register.errors[1]}</li>
                        <li>${language.register.errors[2]}</li>
                        <li>${language.register.errors[3]}</li>
                        <li>${language.register.errors[4]}</li>
                    </ul>
                </div>
                <div class="lineBtn">
                    <button id="sendBtn"class="retroBtn importantSubmit retroShade btnColor-green">${language.login.submit}</button>
                </div>
            </div>
        </div>
        `
    }
    setup(){
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpeg")

        const urlParams = new URLSearchParams(window.location.search);
        document.querySelector("#sendBtn").addEventListener("click", ()=>{
            let list = document.querySelectorAll(".data");
            let toSend = {};

            if ((!passwordValidator(list[0].value) || !passwordValidator(list[1].value) ) || (list[1].value != list[0].value))
            {
                document.querySelector(".errors").style.display = "flex";
                return ;
            }
            for (let el of list)
                toSend[el.name] = sha256(el.value);
            API.recoveryPassword(toSend, urlParams.get("token"));
        })
    }
}