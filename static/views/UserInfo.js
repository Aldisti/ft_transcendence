import Aview from "/views/abstractView.js";

export default class extends Aview{
    constructor(){
        super();
    }

    getGeneralForm(){
        return `
        <h4 class="title">${this.language.update.generalTitle}</h4>
        <div class="inputLine">
            <label for="${this.language.update.firstName[1]}">${this.language.update.firstName[0]}</label>
            <input type="text" id="${this.language.update.firstName[1]}">
        </div>
        <div class="inputLine">
            <label for="${this.language.update.lastName[1]}">${this.language.update.lastName[0]}</label>
            <input type="text" id="${this.language.update.lastName[1]}">
        </div>
        <div class="inputLine">
            <label for="${this.language.update.birthDate[1]}">${this.language.update.birthDate[0]}</label>
            <input type="date" id="${this.language.update.birthDate[1]}">
        </div>
        <div class="inputLine">
            <label for="${this.language.update.username[1]}">${this.language.update.username[0]}</label>
            <input type="text" id="${this.language.update.username[1]}" disabled="true">
        </div>
        <button class="submit">Submit!</button>
        `
    }

    getPasswordForm(){
        return `
            <h4 class="title">${this.language.update.passwordTitle}</h4>
            <div class="inputLine">
                <label for="${this.language.update.oldPassword[1]}">${this.language.update.oldPassword[0]}</label>
                <input type="password" id="${this.language.update.oldPassword[1]}">
            </div>
            <div class="inputLine">
                <label for="${this.language.update.newPassword[1]}">${this.language.update.newPassword[0]}</label>
                <input type="password" id="${this.language.update.newPassword[1]}">
            </div>
            <div class="inputLine">
                <label for="${this.language.update.confirmNewPassword[1]}">${this.language.update.confirmNewPassword[0]}</label>
                <input type="password" id="${this.language.update.confirmNewPassword[1]}">
            </div>
            <button class="submit">Submit!</button>
        `
    } 
    getEmailForm(){
        return `
            <h4 class="title">${this.language.update.emailTitle}</h4>
            <div class="inputLine">
                <label for="${this.language.update.email[1]}">${this.language.update.email[0]}</label>
                <input type="password" id="${this.language.update.email[1]}">
            </div>
            <div class="inputLine">
                <label for="${this.language.update.password[1]}">${this.language.update.password[0]}</label>
                <input type="password" id="${this.language.update.password[1]}">
            </div>
            <button class="submit">Submit!</button>
        `
    }
    getProfilePictureForm(){
        return `
            <h4 class="title">${this.language.update.pictureTitle}</h4>
            <div class="profilePict">
                <img src="https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg">
            </div>
            <div class="inputLine">
                <label id="labelInpFile" for="${this.language.update.profilePicture[1]}"><img class="fileIcon" src="/imgs/fileIcon.png"><span class="selectFileText">Select New Photo...</span></label>
                <input id="inpFile" type="file" id="${this.language.update.profilePicture[1]}">
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
    setup(){
        if (localStorage.getItem("style") == "modern")
        document.querySelector("#app").style.backgroundImage = "url('https://c4.wallpaperflare.com/wallpaper/105/526/545/blur-gaussian-gradient-multicolor-wallpaper-preview.jpg')";
        else
        	document.querySelector("#app").style.backgroundImage = "url('/imgs/backLogin.png')";
        document.querySelector("#app").style.backgroundSize = "cover"
        document.querySelector("#app").style.backgroundRepeat = "repeat"
        document.querySelector(".formSide").innerHTML = this.getGeneralForm();
        window.addEventListener("click", (e)=>{
            if (e.target.classList.contains("passwordForm"))
                document.querySelector(".formSide").innerHTML = this.getPasswordForm();
            if (e.target.classList.contains("generalForm"))
                document.querySelector(".formSide").innerHTML = this.getGeneralForm();
            if (e.target.classList.contains("emailForm"))
                document.querySelector(".formSide").innerHTML = this.getEmailForm();
            if (e.target.classList.contains("pictForm"))
                document.querySelector(".formSide").innerHTML = this.getProfilePictureForm();
        })
    }
}