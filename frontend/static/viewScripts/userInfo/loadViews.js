import * as API from "/API/APICall.js";
import Router from "/router/mainRouterFunc.js"

function isNumber(value) {
    return typeof value === 'number';
}

function sendEmailTfaCode() {
    let code = document.querySelector("#emailTfaCode").value;
    if (code.length == 6 || code.length == 10) {
        API.validateCode(1, code).then(res => {}).catch(e=>{
            console.log(e);
        });
    }
}

function sendAppTfaCode() {
    let code = document.querySelector("#appTfaCode").value;
    if (code.length == 6 || code.length == 10) {
        API.validateCode(1, code).then(res => {}).catch(e=>{
            console.log(e);
        });
    }
}

function sendAppTfaCodeRemove() {
    let code = document.querySelector("#removeTfaCode").value;
    if (code.length == 6 || code.length == 10) {
        API.removeTfa(1, code).then(res => {}).catch(e=>{
            console.log(e);
        });
    }
}

function waitForEmailBtn(dupThis) {
    document.querySelector(".showForm").innerHTML = dupThis.get2faEmailForm();
    document.querySelector(".sendCode").addEventListener("click", sendEmailTfaCode)
        //setup listener for EMAIL RESEND button if pressed send otp code via mail
    document.querySelector(".resendBtn").addEventListener("click", () => {
        API.getEmailCode(1).catch(e=>{
            console.log(e);
        });
    })
    API.activateTfa(1, "em").then(res => {
        if (Object.keys(res).length == 0)
        //send inserted code to backend to be validated
            API.getEmailCode(1).catch(e=>{
                console.log(e);
            });
    }).catch(e=>{
        console.log(e);
    });
}

function waitForAppBtn(dupThis) {
    document.querySelector(".showForm").innerHTML = dupThis.get2faAppForm();
    API.activateTfa(1, "sw").then(res => {
        window.otp_token = res.token;
        document.querySelector(".codeDisplay").innerHTML = res.token;
        new window.QRCode(document.getElementById("qrCode"), {
            text: res.uri,
            width: window.innerWidth < 900 ? document.querySelector(".qrLine").clientWidth - 50 : 250,
            height: window.innerWidth < 900 ? document.querySelector(".qrLine").clientWidth - 50 : 250
        });
        document.querySelector(".sendCode").addEventListener("click", sendAppTfaCode)
    }).catch(e=>{
        console.log(e);
    });
}

async function handleIntraLink(dupThis) {
    //check if user has a 42 account linked setting localstorage
    await API.getIntraStatus(1).then(res => {
        if (res.intra == true)
            localStorage.setItem("intraLinked", "true")
        else {
            localStorage.removeItem("intraLinked")
                //ask to the server the link to connect user's 42 account
            API.getIntraUrl("link").then(res => {
                if (res != "")
                    dupThis.intraUrl = res
            }).catch(e=>{
                console.log(e);
            });
        }
        if (res.google == true)
            localStorage.setItem("googleLinked", "true")
        else {
            localStorage.removeItem("googleLinked")
                //ask to the server the link to connect user's 42 account
            API.getGoogleUrl().then(res => {
                dupThis.googleUrl = res;
            }).catch(e=>{
                console.log(e);
            });
        }
    }).catch(e=>{
        console.log(e);
    });
}

export function loadPasswordPage(dupThis) {
    localStorage.setItem("selectedForm", "password")
    document.querySelector(".formMenu").innerHTML = dupThis.getPasswordForm();
}
export function loadInfoPage(dupThis) {
    localStorage.setItem("selectedForm", "info")
    dupThis.getGeneralForm();
}
export function loadEmailPage(dupThis) {
    localStorage.setItem("selectedForm", "email")
    document.querySelector(".formMenu").innerHTML = dupThis.getEmailForm();
}
export function loadPicturePage(dupThis) {
    localStorage.setItem("selectedForm", "picture")
    document.querySelector(".formMenu").innerHTML = dupThis.getProfilePictureForm();
    API.getUserInfo(1, localStorage.getItem("username")).then(res => {
        if (res.user_info.picture != null)
            document.querySelector(".updateImgForm").src = res.user_info.picture;
    }).catch(e=>{
        console.log(e);
    });
}
export async function loadSecurityPage(dupThis) {
    localStorage.setItem("selectedForm", "twofa");

    await handleIntraLink(dupThis);
    //check if the user already have enabled TFA if so show the form to remove it
    API.isTfaACtive(1).then(res => {
        if (localStorage.getItem("is_active") != undefined) {
            //if the user has email TFA send otp via email
            if (localStorage.getItem("is_active") == "EM")
                API.getEmailCode(1).then();
            document.querySelector(".formMenu").innerHTML = dupThis.get2faRemoveForm();
            document.querySelector(".sendCode").addEventListener("click", sendAppTfaCodeRemove)
            return;
        }
    }).catch(e=>{
        console.log(e);
    });

    //if user not yet enabled TFA display menu to select activation method
    document.querySelector(".formMenu").innerHTML = dupThis.get2faChoice();

    //setup listener for EMAIL TFA form if clicked the form is displayed
    document.querySelector(".emailChoice").addEventListener("click", waitForEmailBtn.bind(null, dupThis))

    //setup listener for APP TFA form if clicked the form is displayed
    document.querySelector(".appChoice").addEventListener("click", waitForAppBtn.bind(null, dupThis))
}

export function triggerLogout(dupThis) {
    if (!confirm(dupThis.language.update.confirmLogout))
        return;
    API.logout(1).catch(e=>{
        console.log(e);
    });
}

export function triggerIntraLink(dupThis) {
    if (localStorage.getItem("intraLinked") == null && confirm(dupThis.language.update.intraLinkConfirm)) {
        window.location.href = dupThis.intraUrl;
    } else if (localStorage.getItem("intraLinked") != null && confirm(dupThis.language.update.intraUnlinkConfirm)) {
        API.unlinkIntra(1).then(() => {
            document.querySelector(".intra").style.backgroundColor = "var(--bs-warning)"
        }).catch(e=>{
            console.log(e);
        });;
    }
}

export function triggerGoogleLink(dupThis) {
    if (localStorage.getItem("googleLinked") == null && confirm(dupThis.language.update.googleLinkConfirm))
        window.location.href = dupThis.googleUrl;
    else if (localStorage.getItem("googleLinked") != null && confirm(dupThis.language.update.googleUnlinkConfirm)) {
        API.unlinkGoogle(1).then(() => {
            history.pushState(null, null, "/account/");
            Router();
        }).catch(e=>{
            console.log(e);
        });;
    }
}
export function triggerLogoutAll(dupThis) {
    if (confirm("Do you really want to logout from all devices?"))
        API.logoutAll(1).catch(e=>{
            console.log(e);
        });
}