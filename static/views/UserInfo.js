import * as controls from '/viewScripts/userInfo/updateCheck.js';
import Router from "/router/mainRouterFunc.js"
import * as URL from "/API/URL.js"
import Aview from "/views/abstractView.js";
import * as API from "/API/APICall.js";
import sha256 from "/scripts/crypto.js";

export default class extends Aview {
    constructor() {
        super();
        this.intraUrl = "";
        this.selectedForm = "info"
        this.errors = {};
    }

    async getGeneralForm() {
        API.getUserInfo(1).then(res => {
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

    getHtml() {
        return `
            <div class="userInfoContainer bg-lg">
                <div class="leftSide bg-dark">
                    <h6 class="formLink info generalForm">${this.language.update.generalTitle}</h6>
                    <h6 class="formLink password passwordForm">${this.language.update.passwordTitle}</h6>
                    <h6 class="formLink email emailForm">${this.language.update.emailTitle}</h6>
                    <h6 class="formLink picture pictForm">${this.language.update.pictureTitle}</h6>
                    <h6 class="formLink intra">${this.language.update.linkToIntra}</h6>
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
        this.errors = { newPassword: "test" };
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
                if (res.picture != null)
                  document.querySelector(".updateImgForm").src = res.picture;
            })
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
            window.location.href = this.intraUrl;
        }
    }

    highlightFormMenu(formName) {
        document.querySelectorAll(".formLink").forEach(el => {
            if (el.classList.contains("intra") && el.style.backgroundColor == "gray")
                return;
            el.style.backgroundColor = "#f0ead2";
            el.style.color = "black";
        })
        document.querySelector(`.${formName}`).style.backgroundColor = "var(--bs-success)";
        document.querySelector(`.${formName}`).style.color = "white";
    }

    setup() {
        document.querySelector(".intra").style.backgroundColor = "gray"
        API.getIntraUrl("link").then(res=>{
            if (res != "")
            {
                this.intraUrl = res;
                document.querySelector(".intra").style.backgroundColor = "";
            }
        })

        API.convertIntraTokenAccount(1).then(res=>{
            if (!res)
            {
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
                if (localStorage.getItem("selectedForm") == undefined)
                    localStorage.setItem("selectedForm", "info");
                this.highlightFormMenu(localStorage.getItem("selectedForm"))
                this.changeForm(document.querySelector("body"), localStorage.getItem("selectedForm"))
        
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
                    this.highlightFormMenu(this.selectedForm)
                    if (e.target.classList.contains("submit"))
                        this.performChecksAndSubmit(this.collectData());
                })
            }
        })
    }
}