import * as controls from '/viewScripts/userInfo/updateCheck.js';
import Router from "/router/mainRouterFunc.js"
import Aview from "/views/abstractView.js";
import * as API from "/API/APICall.js";
import sha256 from "/scripts/crypto.js";

export default class extends Aview {
    constructor() {
        super();
        this.selectedForm = "info"
        this.errors = {};
    }

    getGeneralForm() {
        return `
        <div class="formContainer">
        <div class="inputLine">
            <label for="${this.language.update.username[1]}">${this.language.update.username[0]}</label>
            <input class="inputData" type="text" value="mpaterno" id="${this.language.update.username[1]}" disabled="true">
        </div>
        <div class="inputLine">
            <div class="f-line">
                <div class="myTooltip">
                    ?
                    <span id="${this.language.update.firstName[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
                </div> 
                <label for="${this.language.update.firstName[1]}">${this.language.update.firstName[0]}</label>
            </div> 
            <input class="inputData" type="text" id="${this.language.update.firstName[1]}">
        </div>
        <div class="inputLine">
            <div class="f-line">
                <div class="myTooltip">
                    ?
                    <span id="${this.language.update.lastName[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
                </div> 
                <label for="${this.language.update.lastName[1]}">${this.language.update.lastName[0]}</label>
            </div> 
            <input class="inputData" type="text" id="${this.language.update.lastName[1]}">
        </div>
        <div class="inputLine">
            <div class="f-line">
                <div class="myTooltip">
                    ?
                    <span id="${this.language.update.birthDate[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
                </div> 
                <label for="${this.language.update.birthDate[1]}">${this.language.update.birthDate[0]}</label>
            </div> 
            <input class="inputData" type="date" id="${this.language.update.birthDate[1]}">
        </div>
        <button class="submit">Submit!</button>
        </div>
        `
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
        <div class="formContainer">
            <div class="imageForm">
                <div class="profilePict">
                    <img src="https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg">
                </div>
                <div class="inputLineFile">
                    <label id="labelInpFile" for="inpFile"><img class="fileIcon" src="/imgs/fileIcon.png"><span class="selectFileText">Select New Photo...</span></label>
                    <input class="inputData" id="inpFile" type="file" id="${this.language.update.profilePicture[1]}">
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
                    <h4 class="formLink info generalForm">${this.language.update.generalTitle}</h4>
                    <h4 class="formLink password passwordForm">${this.language.update.passwordTitle}</h4>
                    <h4 class="formLink email emailForm">${this.language.update.emailTitle}</h4>
                    <h4 class="formLink picture pictForm">${this.language.update.pictureTitle}</h4>
                    <h4 class="formLink picture logout">${this.language.update.logout}</h4>
                </div>
                <div class="handle">
                >
                </div>
                <div class="formMenu">

                </div>
            </div>
        `
    }

    prepareInfoForm(form) {
        let ret = { user_info: {} };

        Object.keys(form).forEach((key) => {
            ret.user_info[key] = form[key].value;
        })
        console.log(ret)
        return (ret);
    }

    preparePasswordForm(form) {
        console.log(form)
        let ret = {
            [this.language.update.oldPassword[1]]: sha256(form[this.language.update.oldPassword[1]].value),
            [this.language.update.newPassword[1]]: sha256(form[this.language.update.newPassword[1]].value),
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

    async performChecksAndSubmit(form) {
        let title = document.querySelector(".title");

        //will perfom check for general user info
        if (this.selectedForm == "info" && controls.checkChangeInfoForm(form, this.errors)) {
            API.updateInfo(this.prepareInfoForm(form)).then((res) => {
                this.errors = res.user_info;
                controls.checkInfo(form, this.errors)
            })
        }

        //will perfom check for email
        if (this.selectedForm == "email" && await controls.checkChangeEmailForm(form, this.errors)) {
            API.updateEmail(this.prepareEmailForm(form)).then((res) => {


            })
        }

        //will perfom check for password
        if (this.selectedForm == "password" && controls.checkChangePasswordForm(form, this.errors)) {
            API.updatePassword(this.preparePasswordForm(form)).then((res) => {
                if (!res.ok) {
                    document.querySelector(`#${this.language.update.oldPassword[1]}-tooltip`).innerHTML = this.language.update.passwordErrors[0];
                    document.querySelectorAll("input")[0].style.backgroundColor = "#A22C29";
                    document.querySelectorAll("input")[0].style.color = "white"
                }
            });
        }

        //will perfom check for picture
        if (this.selectedForm == "picture")
            console.log("picture")
    }

    collectData() {
        let values = document.querySelectorAll(".inputData");
        let form = {};
        this.errors = {};

        for (let val of values)
            form[val.id] = val
        return (form);
    }

    changeForm(e) {
        this.errors = { newPassword: "test" };

        //will load the form to change password
        if (e.target.classList.contains("passwordForm")) {
            this.selectedForm = "password";
            document.querySelector(".formMenu").innerHTML = this.getPasswordForm();
        }

        //will load the form to change general user info
        else if (e.target.classList.contains("generalForm")) {
            this.selectedForm = "info";
            document.querySelector(".formMenu").innerHTML = this.getGeneralForm();
        }

        //will load the form to change email
        else if (e.target.classList.contains("emailForm")) {
            this.selectedForm = "email";
            document.querySelector(".formMenu").innerHTML = this.getEmailForm();
        }

        //will load the form to change picture
        else if (e.target.classList.contains("pictForm")) {
            this.selectedForm = "picture";
            document.querySelector(".formMenu").innerHTML = this.getProfilePictureForm();
        }

        //will load the form to change picture
        else if (e.target.classList.contains("logout")) {
            this.selectedForm = "logout";
            if (!confirm(this.language.update.confirmLogout))
                return;
            API.logout(1)
        }
    }

    highlightFormMenu(formName) {
        document.querySelectorAll(".formLink").forEach(el => {
            el.style.backgroundColor = "#f0ead2";
            el.style.color = "black";
        })
        document.querySelector(`.${formName}`).style.backgroundColor = "var(--bs-danger)";
        document.querySelector(`.${formName}`).style.color = "white";
    }

    setup() {
        if (localStorage.getItem("style") == "modern")
            document.querySelector("#app").style.backgroundImage = "url('https://c4.wallpaperflare.com/wallpaper/105/526/545/blur-gaussian-gradient-multicolor-wallpaper-preview.jpg')";
        else
            document.querySelector("#app").style.backgroundImage = "url('/imgs/backLogin.png')";
        document.querySelector("#app").style.backgroundSize = "cover"
        document.querySelector("#app").style.backgroundRepeat = "repeat"
        document.querySelector(".formMenu").innerHTML = this.getGeneralForm();
        this.highlightFormMenu(this.selectedForm)
            //setting the listener for click that will handle both the form change and the submit event performing the checks depending
            //on the current form
        this.listeners.push([document, document.cloneNode(true)]);
        document.querySelector(".userInfoContainer").addEventListener("click", (e) => {
            if (e.target.classList.contains("handle")) {
                if (document.querySelector(".handle").classList.contains("open")) {
                    console.log("hey");
                    document.querySelector(".handle").classList.remove("open");
                    document.querySelector(".handle").style.transform = `translateX(0)`;
                    document.querySelector(".handle").innerHTML = ">";
                    document.querySelector(".leftSide").style.transform = `translateX(-${document.querySelector(".leftSide").clientWidth}px)`;
                } else {
                    console.log(`translateX(${document.querySelector(".leftSide").clientWidth}px)`)
                    document.querySelector(".handle").classList.add("open");
                    document.querySelector(".handle").style.transform = `translateX(${document.querySelector(".leftSide").clientWidth}px)`;
                    document.querySelector(".handle").innerHTML = "<";
                    document.querySelector(".leftSide").style.transform = "translateX(0)";
                }
                return;
            }
            this.changeForm(e);
            this.highlightFormMenu(this.selectedForm)
            if (e.target.classList.contains("submit"))
                this.performChecksAndSubmit(this.collectData());
        })
    }
}