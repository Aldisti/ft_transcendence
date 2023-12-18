import * as controls from '/viewScripts/register/updateCheck.js'
import Aview from "/views/abstractView.js";
import updateInfoAPI from "/API/updateInfo.js"
import updatePasswordAPI from "/API/updatePassword.js"
import sha256 from "/scripts/crypto.js"


export default class extends Aview{
    constructor(){
        super();
        this.errors = {};
    }

    getGeneralForm(){
        return `
        <h4 class="title info">${this.language.update.generalTitle}</h4>
        <div class="inputLine">
            <div class="myTooltip">
                ?
                <span id="${this.language.update.firstName[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
            </div> 
            <label for="${this.language.update.firstName[1]}">${this.language.update.firstName[0]}</label>
            <input class="inputData" type="text" id="${this.language.update.firstName[1]}">
        </div>
        <div class="inputLine">
            <div class="myTooltip">
                ?
                <span id="${this.language.update.lastName[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
            </div> 
            <label for="${this.language.update.lastName[1]}">${this.language.update.lastName[0]}</label>
            <input class="inputData" type="text" id="${this.language.update.lastName[1]}">
        </div>
        <div class="inputLine">
            <div class="myTooltip">
                ?
                <span id="${this.language.update.birthDate[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
            </div> 
            <label for="${this.language.update.birthDate[1]}">${this.language.update.birthDate[0]}</label>
            <input class="inputData" type="date" id="${this.language.update.birthDate[1]}">
        </div>
        <div class="inputLine">
            <label for="${this.language.update.username[1]}">${this.language.update.username[0]}</label>
            <input class="inputData" type="text" id="${this.language.update.username[1]}" disabled="true">
        </div>
        <button class="submit">Submit!</button>
        `
    }

    getPasswordForm(){
        return `
            <h4 class="title password">${this.language.update.passwordTitle}</h4>
            <div class="inputLine">
                <div class="myTooltip">
                    ?
                    <span id="${this.language.update.oldPassword[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
                </div> 
                <label for="${this.language.update.oldPassword[1]}">${this.language.update.oldPassword[0]}</label>
                <input class="inputData" type="password" id="${this.language.update.oldPassword[1]}" value="Marketto7M?">
                <div class="switch">
                    <img src="/imgs/openEye.png" alt="">
                </div>
            </div>
            <div class="inputLine">
                <div class="myTooltip">
                    ?
                    <span id="${this.language.update.newPassword[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
                </div> 
                <label for="${this.language.update.newPassword[1]}">${this.language.update.newPassword[0]}</label>
                <input class="inputData" type="password" id="${this.language.update.newPassword[1]}" value="Marketto7M?">
                <div class="switch">
                    <img src="/imgs/openEye.png" alt="">
                </div>
            </div>
            <div class="inputLine">
                <div class="myTooltip">
                    ?
                    <span id="${this.language.update.confirmNewPassword[1]}-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
                </div> 
                <label for="${this.language.update.confirmNewPassword[1]}">${this.language.update.confirmNewPassword[0]}</label>
                <input class="inputData" type="password" id="${this.language.update.confirmNewPassword[1]}" value="Marketto7M?">
                <div class="switch">
                    <img src="/imgs/openEye.png" alt="">
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
        `
    } 
    getEmailForm(){
        return `
            <h4 class="title email">${this.language.update.emailTitle}</h4>
            <div class="inputLine">
                <label for="${this.language.update.email[1]}">${this.language.update.email[0]}</label>
                <input class="inputData" type="password" id="${this.language.update.email[1]}">
            </div>
            <div class="inputLine">
                <label for="${this.language.update.password[1]}">${this.language.update.password[0]}</label>
                <input class="inputData" type="password" id="${this.language.update.password[1]}">
            </div>
            <button class="submit">Submit!</button>
        `
    }
    getProfilePictureForm(){
        return `
            <h4 class="title picture">${this.language.update.pictureTitle}</h4>
            <div class="profilePict">
                <img src="https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg">
            </div>
            <div class="inputLine">
                <label id="labelInpFile" for="${this.language.update.profilePicture[1]}"><img class="fileIcon" src="/imgs/fileIcon.png"><span class="selectFileText">Select New Photo...</span></label>
                <input class="inputData" id="inpFile" type="file" id="${this.language.update.profilePicture[1]}">
            </div>
            <button class="submit">Submit!</button>
        ` 
    }
    getHtml(){
        return `
            <div class="userInfoContainer">
                <div class="leftSide">
                    <h4 class="formLink generalForm">General Info</h4>
                    <h4 class="formLink passwordForm">Change Passowrd</h4>
                    <h4 class="formLink emailForm">Change Email</h4>
                    <h4 class="formLink pictForm">Change Picture</h4>
                </div>
                <div class="formSide">

                </div>
            </div>
        `
    }

    prepareInfoForm(form){
        let ret = {user_info:{}};

        Object.keys(form).forEach((key)=>{
            ret.user_info[key] = form[key].value;
        })
        console.log(ret)
        return (ret);
    }

    preparePasswordForm(form){
        console.log(form)
        let ret = {
            [this.language.update.oldPassword[1]]: sha256(form[this.language.update.oldPassword[1]].value),
            [this.language.update.newPassword[1]]: sha256(form[this.language.update.newPassword[1]].value),
        }
        return (ret);
    }

    doChecks(form){
        let title = document.querySelector(".title");

        //will perfom check for general user info
        if (title.classList.contains("info") && controls.checkInfo(form, this.errors))
        {
            updateInfoAPI(this.prepareInfoForm(form)).then((res)=>{
                this.errors = res.user_info;
                controls.checkInfo(form, this.errors)
            })
        }

        //will perfom check for email
        if (title.classList.contains("email"))
            console.log("email")

        //will perfom check for password
        if (title.classList.contains("password") && controls.checkPassword(form, this.errors))
        {
            updatePasswordAPI(this.preparePasswordForm(form)).then((res)=>{
                if (!res.ok)
                {
                    document.querySelector(`#${this.language.update.oldPassword[1]}-tooltip`).innerHTML = this.language.update.passwordErrors[0];
                    document.querySelectorAll("input")[0].style.backgroundColor = "#A22C29";
                    document.querySelectorAll("input")[0].style.color = "white"
                }
            });
        }
        
        //will perfom check for picture
        if (title.classList.contains("picture"))
            console.log("picture")
    }

    collectData(){
        let values = document.querySelectorAll(".inputData");
        let form = {};
        this.errors = {};

        for (let val of values)
            form[val.id] = val
        this.doChecks(form);
    }

    handleClick(e){
        this.errors = {newPassword: "test"};

        //will load the form to change password
        if (e.target.classList.contains("passwordForm"))
        {
            document.querySelector(".formSide").innerHTML = this.getPasswordForm();
            document.querySelectorAll(".switch").forEach((el)=>{
                el.addEventListener("click", (e)=>{
                    if (el.parentNode.querySelector("input").type == "text")
                        el.parentNode.querySelector("input").type = "password";
                    else
                        el.parentNode.querySelector("input").type = "text";
                })
            })
        }

        //will load the form to change general user info
        else if (e.target.classList.contains("generalForm"))
            document.querySelector(".formSide").innerHTML = this.getGeneralForm();

        //will load the form to change email
        else if (e.target.classList.contains("emailForm"))
            document.querySelector(".formSide").innerHTML = this.getEmailForm();

        //will load the form to change picture
        else if (e.target.classList.contains("pictForm"))
            document.querySelector(".formSide").innerHTML = this.getProfilePictureForm();

        else if (e.target.classList.contains("submit"))
            this.collectData();
    }

    setup(){
        if (localStorage.getItem("style") == "modern")
        document.querySelector("#app").style.backgroundImage = "url('https://c4.wallpaperflare.com/wallpaper/105/526/545/blur-gaussian-gradient-multicolor-wallpaper-preview.jpg')";
        else
        	document.querySelector("#app").style.backgroundImage = "url('/imgs/backLogin.png')";
        document.querySelector("#app").style.backgroundSize = "cover"
        document.querySelector("#app").style.backgroundRepeat = "repeat"
        document.querySelector(".formSide").innerHTML = this.getGeneralForm();
        document.addEventListener("click", (e)=>{
            this.handleClick(e);
        })
    }
}