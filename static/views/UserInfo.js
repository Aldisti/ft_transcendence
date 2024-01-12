import * as controls from '/viewScripts/userInfo/updateCheck.js';
import Router from "/router/mainRouterFunc.js"
import * as URL from "/API/URL.js"
import Aview from "/views/abstractView.js";
import * as API from "/API/APICall.js";
import sha256 from "/scripts/crypto.js";

function isNumber(value) {
    return typeof value === 'number';
}

function sendEmailTfaCode()
{
    let code = document.querySelector("#emailTfaCode").value;
    console.log(code)
    if (code.length == 6 || code.length == 10)
    {
        API.validateCode(1, code).then(res=>{
        })
    }
}
function sendAppTfaCode()
{
    let code = document.querySelector("#appTfaCode").value;
    console.log(code)
    if (code.length == 6 || code.length == 10)
    {
        API.validateCode(1, code).then(res=>{
        })
    }
}
function sendAppTfaCodeRemove()
{
    let code = document.querySelector("#removeTfaCode").value;
    console.log(code)
    if (code.length == 6 || code.length == 10)
    {
        API.removeTfa(1, code).then(res=>{
        })
    }
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

window.goHome = ()=>{
    history.pushState(null, null, "/home");
    Router();
    window.location.reload(); 
}

export default class extends Aview {
    constructor() {
        super();
        this.intraUrl = "";
        this.selectedForm = "info"
        this.errors = {};
    }

    async getGeneralForm() {
        API.getUserInfo(1).then(res => {
            res = res.user_info
            document.querySelector(".formMenu").innerHTML = `
                <div class="formContainer">
                <div class="inputLine">
                    <label for="${this.language.update.username[1]}">${this.language.update.username[0]}</label>
                    <input class="inputData" type="text" value="${localStorage.getItem("username")}" id="${this.language.update.username[1]}" disabled="true">
                </div>
                <div class="inputLine">
                    <div class="f-line">
                        <div class="myTooltip">
                            ?
                            <span id="${this.language.update.firstName[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
                        </div> 
                        <label for="${this.language.update.firstName[1]}">${this.language.update.firstName[0]}</label>
                    </div> 
                    <input class="inputData" value="${res.first_name}" type="text" id="${this.language.update.firstName[1]}">
                </div>
                <div class="inputLine">
                    <div class="f-line">
                        <div class="myTooltip">
                            ?
                            <span id="${this.language.update.lastName[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
                        </div> 
                        <label for="${this.language.update.lastName[1]}">${this.language.update.lastName[0]}</label>
                    </div> 
                    <input value="${res.last_name}" class="inputData" type="text" id="${this.language.update.lastName[1]}">
                </div>
                <div class="inputLine">
                    <div class="f-line">
                        <div class="myTooltip">
                            ?
                            <span id="${this.language.update.birthDate[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
                        </div> 
                        <label for="${this.language.update.birthDate[1]}">${this.language.update.birthDate[0]}</label>
                    </div> 
                    <input value="${res.birthdate}" class="inputData" type="date" id="${this.language.update.birthDate[1]}">
                </div>
                <button class="submit">Submit!</button>
                </div>
            `
        })
    }

    getPasswordForm() {
        return `
        <div class="formContainer">
            <div class="inputLine">
                <div class="f-line">
                    <div class="myTooltip">
                        ?
                        <span id="${this.language.update.oldPassword[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
                    </div> 
                    <label for="${this.language.update.oldPassword[1]}">${this.language.update.oldPassword[0]}</label>
                </div> 
                <div class="passInp">
                    <input size="small" class="inputData" type="password" id="${this.language.update.oldPassword[1]}">
                    <div onclick="window.switchVisibility(this)" class="passwordSwitch">
                        <img src="/imgs/openEye.png" alt="">
                    </div>
                </div>

            </div>
            <div class="inputLine">
                <div class="f-line">
                    <div class="myTooltip">
                        ?
                        <span id="${this.language.update.newPassword[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
                    </div> 
                    <label for="${this.language.update.newPassword[1]}">${this.language.update.newPassword[0]}</label>
                </div> 
                <div class="passInp">
                    <input size="small" class="inputData" type="password" id="${this.language.update.newPassword[1]}">
                    <div onclick="window.switchVisibility(this)" class="passwordSwitch">
                        <img src="/imgs/openEye.png" alt="">
                    </div>
                </div>
            </div>
            <div class="inputLine">
                <div class="f-line">
                    <div class="myTooltip">
                        ?
                        <span id="${this.language.update.confirmNewPassword[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
                    </div> 
                    <label for="${this.language.update.confirmNewPassword[1]}">${this.language.update.confirmNewPassword[0]}</label>
                </div> 
                <div class="passInp">
                    <input size="small" class="inputData" type="password" id="${this.language.update.confirmNewPassword[1]}">
                    <div onclick="window.switchVisibility(this)" class="passwordSwitch">
                        <img src="/imgs/openEye.png" alt="">
                    </div>
                </div>
            </div>
            <div class="errors retroShade">
                <ul>
                    <li>${this.language.register.errors[0]}</li>
                    <li>${this.language.register.errors[1]}</li>
                    <li>${this.language.register.errors[2]}</li>
                    <li>${this.language.register.errors[3]}</li>
                    <li>${this.language.register.errors[4]}</li>
                </ul>
            </div>
            <button class="submit">Submit!</button>
            </div>
        `
    }
    getEmailForm() {
        return `
        <div class="formContainer">
            <div class="inputLine">
                <div class="f-line">
                    <div class="myTooltip">
                        ?
                        <span id="${this.language.update.email[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
                    </div> 
                    <label for="${this.language.update.email[1]}">${this.language.update.email[0]}</label>
                </div> 
                <input class="inputData" type="text" id="${this.language.update.email[1]}">
            </div>
            <div class="inputLine">
                <label for="${this.language.update.password[1]}">${this.language.update.password[0]}</label>
                <div class="passInp">
                    <input size="small" class="inputData" type="password" id="${this.language.update.password[1]}">
                    <div onclick="window.switchVisibility(this)" class="passwordSwitch">
                        <img src="/imgs/openEye.png" alt="">
                    </div>
                </div>
            </div>
            <button class="submit">Submit!</button>
        </div>
        `
    }
    getProfilePictureForm() {
        return `
        <div class="imageContainer">
            <div class="imageForm">
                <div class="profilePict">
                    <img class="updateImgForm" src="https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg">
                </div>
                <div class="inputLineFile">
                    <label id="labelInpFile" for="inpFile"><img class="fileIcon" src="/imgs/fileIcon.png"><span class="selectFileText">Select New Photo...</span></label>
                    <input onchange="window.test()" class="inputData" id="inpFile" type="file" id="${this.language.update.profilePicture[1]}">
                </div>
            </div>
            <button class="submit">Submit!</button>
            </div>
        `
    }

    get2faChoice(){
        return `
            <div class="formContainer">
                <div class="decisionBox">
                    <h3 id="intraLink" href="#" class="formLink intra">${this.language.update.linkToIntra}</h3>
                </div>
                <div class="decisionBox">
                    <button class="retroBtn emailChoice" style="background-color: var(--bs-success)">email</button>
                    <button class="retroBtn appChoice" style="background-color: var(--bs-success)">app</button>
                </div>
                <div class="showForm">
                </div>
            </div>
        `
    }

    get2faAppForm(){
        return `
            <div class="formContainerInner">
                <div class="line qrLine">
                    <div id="qrCode">
                    </div>
                    <div class="qrInfo">
                        <ul style="margin: 0;">
                            <li>Scan the QR code With your App</li>
                            <li>the code will be automatically added</li>
                            <li>Insert the given displayed code end Submit</li>
                        </ul>
                    </div>
                </div>
                <div class="line codeInputLine">
                    <label for="emailTfaCode">Insert Code:</label>
                    <div class="codeSend">
                        <input id="appTfaCode" type="text">
                        <button class="retroBtn sendCode" style="background-color: var(--bs-success)">Submit</button>
                    </div>
                </div>
                <div class="line submitLine">
                <button onclick="window.showCode()" class="retroBtn" style="background-color: var(--bs-danger)">show code</button>
                <p class="codeDisplay" style="display: none;">
                Nothing to Show yet
                </p>
                
                </div>
                <div class="line">
                    <div class="codeSend">
                        <button class="retroBtn downloadKeys" style="background-color: var(--bs-warning)">Download Recovery Keys</button>
                        <button disabled="true" class="retroBtn finishBtn" onclick="window.goHome()" style="background-color: var(--bs-warning)">Finish!</button>
                    </div>
                </div>
            </div>
        `
    }
    get2faEmailForm(){
        return `
            <div class="formContainerInner">
                <div class="line infoLine">
                    <div>
                        ${emailError}
                    </div>
                </div>
                <div class="line codeInputLine">
                    <label for="emailTfaCode">Insert Code:</label>
                    <input id="emailTfaCode" type="text">
                </div>
                <div class="line" >
                    <button class="retroBtn resendBtn" style="background-color: var(--bs-warning)">send email</button>
                    <button class="retroBtn sendCode" style="background-color: var(--bs-success)">Submit</button>
                </div>
                <div class="line">
                    <div class="codeSend">
                        <button class="retroBtn downloadKeys" style="background-color: var(--bs-warning)">Download Recovery Keys</button>
                        <button disabled="true" class="retroBtn finishBtn" onclick="window.goHome()" style="background-color: var(--bs-warning)">Finish!</button>
                    </div>
                </div>
            </div>
        `
    }
    get2faRemoveForm(){
        return `
        <div class="formContainer">
            <div class="decisionBox">
                <h3 id="intraLink" href="#" class="formLink intra">${this.language.update.linkToIntra}</h3>
            </div>
            <div class="line infoLine">
                <div>
                    ${localStorage.getItem("is_active") == "EM" ? emailError : qrError}
                </div>
            </div>
            <div class="line codeInputLine">
                <label for="emailTfaCode">Insert Code:</label>
                <input id="removeTfaCode" type="text">
            </div>
            <div class="line" >
                ${localStorage.getItem("is_active") == "EM" ? '<button class="retroBtn sendBtn" style="background-color: var(--bs-warning)">send email</button>' : ""}
                <button class="retroBtn sendCode" style="background-color: var(--bs-success)">Submit</button>
            </div>
        </div>
        `
    }

    getHtml() {
        return `
            <div class="userInfoContainer bg-lg">
                <div class="leftSide bg-dark">
                    <h6 class="formLink info generalForm">${this.language.update.generalTitle}</h6>
                    <h6 class="formLink password passwordForm">${this.language.update.passwordTitle}</h6>
                    <h6 class="formLink email emailForm">${this.language.update.emailTitle}</h6>
                    <h6 class="formLink twofa twofaForm">${this.language.update.security}</h6>
                    <h6 class="formLink picture pictForm">${this.language.update.pictureTitle}</h6>
                    <h6 class="formLink logout">${this.language.update.logout}</h6>
                </div>
                <div class="handle">
                >
                </div>
                <div class="formMenu">

                </div>
            </div>
        `
    }
    preparePasswordForm(form) {
        console.log(form)
        let ret = {
            password: sha256(form[this.language.update.oldPassword[1]].value),
            new_password: sha256(form[this.language.update.newPassword[1]].value),
        }
        return (ret);
    }

    prepareEmailForm(form) {
        let ret = {
            [this.language.update.email[1]]: form[this.language.update.email[1]].value,
            [this.language.update.password[1]]: sha256(form[this.language.update.password[1]].value),
        }
        return (ret);
    }

    prepareInfoForm(form) {
        let obj = {};
        for (let val of Object.keys(form)) {
            obj[val] = form[val].value;
        }
        return (obj);
    }

    async performChecksAndSubmit(form) {
        let title = document.querySelector(".title");

        //will perfom check for general user info
        console.log("hey")
        if (localStorage.getItem("selectedForm") == "info" && controls.checkChangeInfoForm(form, this.errors)) {
            API.updateInfo(this.prepareInfoForm(form), 1).then((res) => {
                if (res == {})
                    return;
                this.errors = res.user_info;
                controls.checkChangeInfoForm(form, this.errors);
            })
        }

        //will perfom check for email
        if (localStorage.getItem("selectedForm") == "email" && await controls.checkChangeEmailForm(form, this.errors)) {
            API.updateEmail(this.prepareEmailForm(form)).then((res) => {


            })
        }

        //will perfom check for password
        if (localStorage.getItem("selectedForm") == "password"&& controls.checkChangePasswordForm(form, this.errors)) {
            console.log(this.preparePasswordForm(form))
            API.updatePassword(1, this.preparePasswordForm(form)).then((res) => {
                if (!res.ok) {
                    document.querySelector(`#${this.language.update.oldPassword[1]}-tooltip`).innerHTML = this.language.update.passwordErrors[0];
                    document.querySelectorAll("input")[0].style.backgroundColor = "#A22C29";
                    document.querySelectorAll("input")[0].style.color = "white"
                }
            });
        }

        //will perfom check for picture
        if (localStorage.getItem("selectedForm") == "picture")
            API.uploadImage(1, form.inpFile)
    }

    collectData() {
        let values = document.querySelectorAll(".inputData");
        let form = {};
        this.errors = {};

        for (let val of values)
            form[val.id] = val
        return (form);
    }

    changeForm(e, byPass) {
        this.errors = { };

        //will load the form to change password
        if (e.classList.contains("passwordForm") || byPass == "password") {
            this.selectedForm = "password";
            localStorage.setItem("selectedForm", "password")
            document.querySelector(".formMenu").innerHTML = this.getPasswordForm();
        }

        //will load the form to change general user info
        else if (e.classList.contains("generalForm") || byPass == "info") {
            this.selectedForm = "info";
            localStorage.setItem("selectedForm", "info")
            this.getGeneralForm();
        }

        //will load the form to change email
        else if (e.classList.contains("emailForm") || byPass == "email") {
            this.selectedForm = "email";
            localStorage.setItem("selectedForm", "email")
            document.querySelector(".formMenu").innerHTML = this.getEmailForm();
        }

        //will load the form to change picture
        else if (e.classList.contains("pictForm") || byPass == "picture") {
            this.selectedForm = "picture";
            localStorage.setItem("selectedForm", "picture")
            document.querySelector(".formMenu").innerHTML = this.getProfilePictureForm();
            API.getUserInfo(1).then(res=>{
                if (res.user_info.picture != null)
                  document.querySelector(".updateImgForm").src = res.user_info.picture;
            })
        }

        else if (e.classList.contains("twofa") || byPass == "twofa") {
            localStorage.setItem("selectedForm", "twofa")
            API.convertIntraTokenAccount(1).then(res=>{})
            API.isTfaACtive(1).then(res=>{})
            API.getUserInfo(1).then(res=>{
                if (res.linked)
                {
                    document.querySelector("#intraLink").innerHTML = "Unlink Intra"
                    localStorage.setItem("intraLinked", "true");
                }
                else
                    localStorage.setItem("intraLinked", "false");
            })
            if (localStorage.getItem("is_active") != undefined)
            {
                if (localStorage.getItem("is_active") == "EM")
                    API.getEmailCode(1).then()
                document.querySelector(".formMenu").innerHTML = this.get2faRemoveForm();
                document.querySelector(".sendCode").addEventListener("click", sendAppTfaCodeRemove)
                return ;
            }
            document.querySelector(".formMenu").innerHTML = this.get2faChoice();

            document.querySelector(".emailChoice").addEventListener("click", ()=>{
                document.querySelector(".showForm").innerHTML = this.get2faEmailForm();
                document.querySelector(".sendCode").addEventListener("click", sendEmailTfaCode)
                document.querySelector(".resendBtn").addEventListener("click", ()=>{
                    API.getEmailCode(1)
                })
                API.activateTfa(1, "em").then(res=>{
                    if (Object.keys(res).length == 0)
                        API.getEmailCode(1)
                })
            })

            document.querySelector(".appChoice").addEventListener("click", ()=>{
                document.querySelector(".showForm").innerHTML = this.get2faAppForm();
                API.activateTfa(1, "sw").then(res=>{
                    window.otp_token = res.token;
                    console.log(document.querySelector(".codeDisplay"))
                    document.querySelector(".codeDisplay").innerHTML = res.token;
                    new window.QRCode(document.getElementById("qrCode"), res.uri);
                    document.querySelector(".sendCode").addEventListener("click", sendAppTfaCode)
                })
            })
            document.querySelector(".intra").style.backgroundColor = "gray"
            API.getIntraUrl("link").then(res=>{
                if (res != "")
                {
                    this.intraUrl = res
                    document.querySelector(".intra").style.backgroundColor = "";
                }
            })
            return;
        }
        //will load the form to change picture
        else if (e.classList.contains("logout")) {
            if (!confirm(this.language.update.confirmLogout))
                return;
            API.logout(1)
        }

        else if (e.classList.contains("intra")) {
            if (!confirm(this.language.update.confirmIntra))
                return;
            if (localStorage.getItem("intraLinked") == "false")
                window.location.href = this.intraUrl;
            else
            {
                console.log("unlink")
                API.unlinkIntra(1);

            }
        }
    }

    highlightFormMenu(formName) {
        console.log(formName)
        document.querySelectorAll(".formLink").forEach(el => {
            el.style.backgroundColor = "#f0ead2";
            el.style.color = "black";
        })
        document.querySelector(`.${formName}`).style.backgroundColor = "var(--bs-success)";
        document.querySelector(`.${formName}`).style.color = "white";
    }

    setup() {
                //defining background
                if (localStorage.getItem("style") == "modern"){
                    document.querySelector("#app").style.backgroundImage = "url('https://c4.wallpaperflare.com/wallpaper/105/526/545/blur-gaussian-gradient-multicolor-wallpaper-preview.jpg')";
                }
                else{
                    document.querySelector("#app").style.backgroundImage = "url('/imgs/backLogin.png')";
                }
                document.querySelector("#app").style.backgroundSize = "cover"
                document.querySelector("#app").style.backgroundRepeat = "repeat"
        
                //defining the start menu item that need to be highlighted
                if (localStorage.getItem("selectedForm") == null)
                    localStorage.setItem("selectedForm", "info");
                
                this.changeForm(document.body, localStorage.getItem("selectedForm"));
                this.highlightFormMenu(localStorage.getItem("selectedForm"))
                document.querySelector(".userInfoContainer").addEventListener("click", (e) => {
                    if (e.target.classList.contains("handle")) {
                        if (document.querySelector(".handle").classList.contains("open")) {
                            document.querySelector(".handle").classList.remove("open");
                            document.querySelector(".handle").style.transform = `translateX(0)`;
                            document.querySelector(".handle").innerHTML = ">";
                            document.querySelector(".leftSide").style.transform = `translateX(-${document.querySelector(".leftSide").clientWidth}px)`;
                        } else {
                            document.querySelector(".handle").classList.add("open");
                            document.querySelector(".handle").style.transform = `translateX(${document.querySelector(".leftSide").clientWidth}px)`;
                            document.querySelector(".handle").innerHTML = "<";
                            document.querySelector(".leftSide").style.transform = "translateX(0)";
                        }
                        return;
                    }
                    this.changeForm(e.target);
                    this.highlightFormMenu(localStorage.getItem("selectedForm"))
                    if (e.target.classList.contains("submit"))
                        this.performChecksAndSubmit(this.collectData());
                })
    }
}