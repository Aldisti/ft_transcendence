import * as controls from '/viewScripts/userInfo/updateCheck.js';
import Router from "/router/mainRouterFunc.js"
import * as URL from "/API/URL.js"
import Aview from "/views/abstractView.js";
import * as API from "/API/APICall.js";
import sha256 from "/scripts/crypto.js";
import * as pages from "/viewScripts/userInfo/loadViews.js"
import handleClick from "/viewScripts/userInfo/handleClick.js"
import * as prepare from "/viewScripts/userInfo/prepareForms.js"

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
        this.googleUrl = "";
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
            </div>
        `
    }

    get2faChoice(){
        let intraAdvice = "Click the button to link your intra profile"
        let googleAdvice = "Click the button to link your google profile"
        let labelIntra = "Link 42 Account"
        let labelGoogle = "Link Google Account"

        if (localStorage.getItem("intraLinked") != null)
        {
            intraAdvice = "your intra profile is linked click the button to unlink";
            labelIntra = "Unlink 42 Account"
        }
        if (localStorage.getItem("googleLinked") != null)
        {
            googleAdvice = "your google profile is linked click the button to unlink";
            labelGoogle = "Unlink google Account"
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
                    <h4>Enable TFA</h4>
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
        let intraAdvice = "Click the button to link your intra profile"
        let googleAdvice = "Click the button to link your google profile"
        let labelIntra = "Link 42 Account"
        let labelGoogle = "Link Google Account"

        if (localStorage.getItem("intraLinked") != null)
        {
            intraAdvice = "your intra profile is linked click the button to unlink";
            labelIntra = "Unlink 42 Account"
        }
        if (localStorage.getItem("googleLinked") != null)
        {
            googleAdvice = "your google profile is linked click the button to unlink";
            labelGoogle = "Unlink google Account"
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
                    <h4>Disable TFA</h4>
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
    }

    highlightFormMenu(formName) {
        //console.log(formName)
        //first all the button is turned the same
        document.querySelectorAll(".formLink").forEach(el => {
            el.style.backgroundColor = "#f0ead2";
            el.style.color = "black";
        })

        //then the one passed as argument is colored in green to highlight it
        document.querySelector(`.${formName}`).style.backgroundColor = "var(--bs-success)";
        document.querySelector(`.${formName}`).style.color = "white";
    }

    setup() {
        this.defineWallpaper("/imgs/backLogin.png", "https://c4.wallpaperflare.com/wallpaper/105/526/545/blur-gaussian-gradient-multicolor-wallpaper-preview.jpg")

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