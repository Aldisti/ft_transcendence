import * as controls from '/viewScripts/userInfo/updateCheck.js';
import Router from "/router/mainRouterFunc.js"
import * as URL from "/API/URL.js"
import Aview from "/views/abstractView.js";
import * as API from "/API/APICall.js";
import sha256 from "/scripts/crypto.js";
import * as pages from "/viewScripts/userInfo/loadViews.js"
import handleClick from "/viewScripts/userInfo/handleClick.js"
import * as prepare from "/viewScripts/userInfo/prepareForms.js"

window.goHome = ()=>{
    history.pushState(null, null, "/home");
    Router();
    window.location.reload(); 
}

export default class extends Aview {
    constructor() {
        super();
        this.intraUrl = "";
        this.googleUrl = "";
        this.selectedForm = "info"
        this.errors = {};
    }

    async getGeneralForm() {
        API.getUserInfo(localStorage.getItem("username")).then(res => {
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
                    <button class="submit importantSubmit">${this.language.update.submit}</button>
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
                <button class="submit" id="submit">${this.language.update.submit}</button>
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
                <button class="submit importantSubmit">${this.language.update.submit}</button>
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
                        <label id="labelInpFile" for="inpFile"><img class="fileIcon" src="/imgs/fileIcon.png"><span class="selectFileText">${this.language.update.selectPhoto}</span></label>
                        <input onchange="window.test()" class="inputData" id="inpFile" accept=".jpg, .jpeg, .png, .gif" type="file" id="${this.language.update.profilePicture[1]}">
                    </div>
                </div>
                    <button class="submit importantSubmit">${this.language.update.submit}</button>
                </div>
            </div>
        `
    }

    get2faChoice(){
        let intraAdvice = this.language.update.intraAdviceLink
        let googleAdvice = this.language.update.googleAdviceLink
        let labelIntra = this.language.update.labelIntraLink
        let labelGoogle = this.language.update.labelGoogleLink

        if (localStorage.getItem("intraLinked") != null)
        {
            intraAdvice = this.language.update.intraAdviceUnLink;
            labelIntra = this.language.update.labelIntraUnLink;
        }
        if (localStorage.getItem("googleLinked") != null)
        {
            googleAdvice = this.language.update.googleAdviceUnLink;
            labelGoogle = this.language.update.labelGoogleUnLink;
        }
        return `
        <div class="formContainer">
            <div class="decisionBox">
                <p class="intraInfo">
                    ${intraAdvice}
                </p>
                <h5 id="intraLink" class=" retroBtn intra" style="background-color: var(${localStorage.getItem("intraLinked") != null ? "--bs-success" : "--bs-warning"});"><div class="imgWrap"><img src="/imgs/logo42.png"></div><span>${labelIntra}</span></h5>
            </div>
        </div>

        <div class="formContainer">
            <div class="decisionBox">
                <p class="googleInfo">
                    ${googleAdvice}
                </p>
                <h5 id="googleLink" class=" retroBtn google" style="background-color: var(${localStorage.getItem("googleLinked") != null ? "--bs-success" : "--bs-warning"});"><div class="imgWrap"><img src="/imgs/logoGoogle.png"></div><span>${labelGoogle}</span></h5>
            </div>
        </div>
        <div class="formContainer">
            <div class="decisionBox">
                <p class="googleInfo">
                    ${this.language.update.logoutAll}
                </p>
                <button class="retroBtn logoutAll" style="background-color: var(--bs-danger)">${this.language.update.logoutAllBtn}</button>
            </div>
        </div>
            <div class="formContainer">
                <div class="decisionBox">
                    <h4>${this.language.update.enableTfa}</h4>
                </div>
                <div class="decisionBox">
                    <button class="retroBtn emailChoice" style="background-color: var(--bs-success)">${this.language.update.enableTfaMail}</button>
                    <button class="retroBtn appChoice" style="background-color: var(--bs-success)">${this.language.update.enableTfaApp}</button>
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
                            <li>${this.language.update.qrSuggest[0]}</li>
                            <li>${this.language.update.qrSuggest[1]}</li>
                            <li>${this.language.update.qrSuggest[2]}</li>
                        </ul>
                    </div>
                </div>
                <div class="line codeInputLine">
                    <label for="emailTfaCode">${this.language.update.insertTfaCode}</label>
                    <div class="codeSend">
                        <input id="appTfaCode" type="text">
                        <button class="retroBtn sendCode" style="background-color: var(--bs-success)">${this.language.update.submit}</button>
                    </div>
                </div>
                <div class="line submitLine">
                    <button onclick="window.showCode()" class="retroBtn" style="background-color: var(--bs-danger)">${this.language.update.showCode}</button>
                <p class="codeDisplay" style="display: none;">
                    ${this.language.update.tempCode}
                </p>
                
                </div>
                <div class="line">
                    <div class="codeSend">
                        <button class="retroBtn downloadKeys" style="background-color: var(--bs-warning)">${this.language.update.downloadKeys}</button>
                        <button disabled="true" class="retroBtn finishBtn" onclick="window.goHome()" style="background-color: var(--bs-warning)">${this.language.update.done}</button>
                    </div>
                </div>
            </div>
        `
    }
    get2faEmailForm(){
        let emailError = `
            <ul style="margin: 0;">
                <li>${this.language.update.emailSuggest[0]}</li>
                <li>${this.language.update.emailSuggest[1]}</li>
                <li>${this.language.update.emailSuggest[2]}</li>
            </ul>
        `
        return `
            <div class="formContainerInner">
                <div class="line infoLine">
                    <div>
                        ${emailError}
                    </div>
                </div>
                <div class="line codeInputLine">
                    <label for="emailTfaCode">${this.language.update.insertTfaCode}</label>
                    <input id="emailTfaCode" type="text">
                </div>
                <div class="line" >
                    <button class="retroBtn resendBtn" style="background-color: var(--bs-warning)">${this.language.update.sendEmail}</button>
                    <button class="retroBtn sendCode" style="background-color: var(--bs-success)">${this.language.update.done}</button>
                </div>
                <div class="line">
                    <div class="codeSend">
                        <button class="retroBtn downloadKeys" style="background-color: var(--bs-warning)">${this.language.update.downloadKeys}</button>
                        <button disabled="true" class="retroBtn finishBtn" onclick="window.goHome()" style="background-color: var(--bs-warning)">${this.language.update.done}</button>
                    </div>
                </div>
            </div>
        `
    }
    get2faRemoveForm(){
        let intraAdvice = this.language.update.intraAdviceLink
        let googleAdvice = this.language.update.googleAdviceLink
        let labelIntra = this.language.update.labelIntraLink
        let labelGoogle = this.language.update.labelGoogleLink
        let qrError = `
        <ul style="margin: 0;">
            <li>${this.language.update.qrSuggest[0]}</li>
            <li>${this.language.update.qrSuggest[1]}</li>
            <li>${this.language.update.qrSuggest[2]}</li>
        </ul>
        `
        let emailError = `
            <ul style="margin: 0;">
                <li>${this.language.update.emailSuggest[0]}</li>
                <li>${this.language.update.emailSuggest[1]}</li>
                <li>${this.language.update.emailSuggest[2]}</li>
            </ul>
        `
        if (localStorage.getItem("intraLinked") != null)
        {
            intraAdvice = this.language.update.intraAdviceUnLink;
            labelIntra = this.language.update.labelIntraUnLink;
        }
        if (localStorage.getItem("googleLinked") != null)
        {
            googleAdvice = this.language.update.googleAdviceUnLink;
            labelGoogle = this.language.update.labelGoogleUnLink;
        }
        return `
        <div class="formContainer">
            <div class="decisionBox">
                <p class="intraInfo">
                    ${intraAdvice}
                </p>
                <h5 id="intraLink" class=" retroBtn intra" style="background-color: var(${localStorage.getItem("intraLinked") != null ? "--bs-success" : "--bs-warning"});"><div class="imgWrap"><img src="/imgs/logo42.png"></div><span>${labelIntra}</span></h5>
            </div>
        </div>

        <div class="formContainer">
            <div class="decisionBox">
                <p class="googleInfo">
                    ${googleAdvice}
                </p>
                <h5 id="googleLink" class=" retroBtn google" style="background-color: var(${localStorage.getItem("googleLinked") != null ? "--bs-success" : "--bs-warning"});"><div class="imgWrap"><img src="/imgs/logoGoogle.png"></div><span>${labelGoogle}</span></h5>
            </div>
        </div>
        <div class="formContainer">
            <div class="decisionBox">
                <p class="googleInfo">
                    Logout from all Devices
                </p>
                <button class="retroBtn logoutAll" style="background-color: var(--bs-danger)">Logout da tutti i dispositibi</button>
            </div>
        </div>
            <div class="formContainer">
                <div class="decisionBox">
                    <h4>${this.language.update.disableTfa}</h4>
                </div>
                <div class="line infoLine">
                    <div>
                        ${localStorage.getItem("is_active") == "EM" ? emailError : qrError}
                    </div>
                </div>
                <div class="line codeInputLine">
                    <label for="emailTfaCode">${this.language.update.insertTfaCode}</label>
                    <input id="removeTfaCode" type="text">
                </div>
                <div class="line" >
                    ${localStorage.getItem("is_active") == "EM" ? `<button class="retroBtn sendBtn" style="background-color: var(--bs-warning)">${this.language.update.sendEmail}</button>` : ""}
                    <button class="retroBtn sendCode" style="background-color: var(--bs-success)">${this.language.update.done}</button>
                </div>
            </div>
        `
    }

    getHtml() {
        return `
            <div class="userInfoContainer bg-lg">
                <div class="leftSide">
                    <h4 class="formLink info generalForm">${this.language.update.generalTitle}</h4>
                    <h4 class="formLink password passwordForm">${this.language.update.passwordTitle}</h4>
                    <h4 class="formLink email emailForm">${this.language.update.emailTitle}</h4>
                    <h4 class="formLink twofa twofaForm">${this.language.update.security}</h4>
                    <h4 class="formLink picture pictForm">${this.language.update.pictureTitle}</h4>
                    <h4 class="formLink logout">${this.language.update.logout}</h4>
                </div>
                <div class="handle">
                    >
                </div>
                <div class="formMenu">
                </div>
            </div>
        `
    }

    async performChecksAndSubmit(form) {

        //will perfom check for general user INFO
        if (localStorage.getItem("selectedForm") == "info" && controls.checkChangeInfoForm(form, this.errors)) {
            API.updateInfo(prepare.prepareInfoForm(form), 1).then((res) => {
                if (res == {})
                    return;
                this.errors = res.user_info;
                controls.checkChangeInfoForm(form, this.errors);
            })
        }

        //will perfom check for EMAIL
        if (localStorage.getItem("selectedForm") == "email" && await controls.checkChangeEmailForm(form, this.errors)) {
            API.updateEmail(prepare.prepareEmailForm(form, this)).then((res) => {})
        }

        //will perfom check for PASSWORD
        if (localStorage.getItem("selectedForm") == "password"&& controls.checkChangePasswordForm(form, this.errors)) {
            //console.log(prepare.preparePasswordForm(form, this))
            API.updatePassword(1, prepare.preparePasswordForm(form, this), this).then((res) => {});
        }

        //will perfom check for PICTURE
        if (localStorage.getItem("selectedForm") == "picture")
            API.uploadImage(1, form.inpFile)
    }

    changeForm(e, byPass) {
        this.errors = { };

        //will load the form to change password
        if (e.classList.contains("passwordForm") || byPass == "password") {
            pages.loadPasswordPage(this);
        }

        //will load the form to change general user info
        else if (e.classList.contains("generalForm") || byPass == "info") {
            pages.loadInfoPage(this);
        }

        //will load the form to change email
        else if (e.classList.contains("emailForm") || byPass == "email") {
            pages.loadEmailPage(this);
        }

        //will load the form to change picture
        else if (e.classList.contains("pictForm") || byPass == "picture") {
            pages.loadPicturePage(this);
        }

        //load the security page where user can link 42 account and enable/disable TFA
        else if (e.classList.contains("twofa") || byPass == "twofa") {
            pages.loadSecurityPage(this);
        }

        //will load the form to change picture
        else if (e.classList.contains("logout")) {
            pages.triggerLogout(this);
        }

        else if (e.classList.contains("intra") || e.parentNode.classList.contains("intra")) {
            pages.triggerIntraLink(this);
        }

        else if (e.classList.contains("google") || e.parentNode.classList.contains("google")) {
            pages.triggerGoogleLink(this);
        }
        else if (e.classList.contains("logoutAll")) {
            pages.triggerLogoutAll(this);
        }
    }

    highlightFormMenu(formName) {
        //console.log(formName)
        //first all the button is turned the same
        document.querySelectorAll(".formLink").forEach(el => {
            el.style.backgroundColor = localStorage.getItem("darkMode") == "true" ? "var(--bs-gray)" : "white";
            el.style.color = localStorage.getItem("darkMode") == "true" ? "white" : "var(--bs-dark)";
        })

        //then the one passed as argument is colored in green to highlight it
        document.querySelector(`.${formName}`).style.backgroundColor = "var(--bs-success)";
        document.querySelector(`.${formName}`).style.color = "white";
    }

    setup() { 
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpeg")

        //defining the start menu item that need to be highlighted
        if (localStorage.getItem("selectedForm") == null)
            localStorage.setItem("selectedForm", "info");
        
        //will load the starting form depending on a localstorage variable and highlight it
        this.changeForm(document.body, localStorage.getItem("selectedForm"));
        this.highlightFormMenu(localStorage.getItem("selectedForm"))

        //setup general click listener that will handle the left side menu acion and style (change color on click)
        document.querySelector(".userInfoContainer").addEventListener("click", handleClick.bind(null, this))
    }
}