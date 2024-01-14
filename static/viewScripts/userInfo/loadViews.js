import * as API from "/API/APICall.js";

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

function waitForEmailBtn(dupThis){
    document.querySelector(".showForm").innerHTML = dupThis.get2faEmailForm();
    document.querySelector(".sendCode").addEventListener("click", sendEmailTfaCode)
    //setup listener for EMAIL RESEND button if pressed send otp code via mail
    document.querySelector(".resendBtn").addEventListener("click", ()=>{
        API.getEmailCode(1)
    })
    API.activateTfa(1, "em").then(res=>{
        if (Object.keys(res).length == 0)
            //send inserted code to backend to be validated
            API.getEmailCode(1)
    })
}

function waitForAppBtn(dupThis){
    document.querySelector(".showForm").innerHTML = dupThis.get2faAppForm();
    API.activateTfa(1, "sw").then(res=>{
        window.otp_token = res.token;
        document.querySelector(".codeDisplay").innerHTML = res.token;
        new window.QRCode(document.getElementById("qrCode"), {
            text: res.uri,
            width: 250,
            height: 250
        });
        document.querySelector(".sendCode").addEventListener("click", sendAppTfaCode)
    })
}

async function handleIntraLink(dupThis)
{
    //check if user has a 42 account linked setting localstorage
    await API.getIntraStatus(1).then(res=>{
        console.log(res)
        if (res.intra == true)
            localStorage.setItem("intraLinked", "true")
        else
        {
            localStorage.removeItem("intraLinked")
            //ask to the server the link to connect user's 42 account
            API.getIntraUrl("link").then(res=>{
                if (res != "")
                    dupThis.intraUrl = res
            })
        }
    })
}

export function loadPasswordPage(dupThis)
{
    localStorage.setItem("selectedForm", "password")
    document.querySelector(".formMenu").innerHTML = dupThis.getPasswordForm();
}
export function loadInfoPage(dupThis)
{
    localStorage.setItem("selectedForm", "info")
    dupThis.getGeneralForm();
}
export function loadEmailPage(dupThis)
{
    localStorage.setItem("selectedForm", "email")
    document.querySelector(".formMenu").innerHTML = dupThis.getEmailForm();
}
export function loadPicturePage(dupThis)
{
    localStorage.setItem("selectedForm", "picture")
    document.querySelector(".formMenu").innerHTML = dupThis.getProfilePictureForm();
    API.getUserInfo(1).then(res=>{
        if (res.user_info.picture != null)
        document.querySelector(".updateImgForm").src = res.user_info.picture;
    })
}
export async function loadSecurityPage(dupThis)
{
    localStorage.setItem("selectedForm", "twofa");

    await handleIntraLink(dupThis);
    //check if the user already have enabled TFA if so show the form to remove it
    API.isTfaACtive(1).then(res=>{
        if (localStorage.getItem("is_active") != undefined)
        {
            //if the user has email TFA send otp via email
            if (localStorage.getItem("is_active") == "EM")
                API.getEmailCode(1).then();
            document.querySelector(".formMenu").innerHTML = dupThis.get2faRemoveForm();
            document.querySelector(".sendCode").addEventListener("click", sendAppTfaCodeRemove)
            return ;
        }
    })
    
    //if user not yet enabled TFA display menu to select activation method
    document.querySelector(".formMenu").innerHTML = dupThis.get2faChoice();
    
    //setup listener for EMAIL TFA form if clicked the form is displayed
    document.querySelector(".emailChoice").addEventListener("click", waitForEmailBtn.bind(null, dupThis))

    //setup listener for APP TFA form if clicked the form is displayed
    document.querySelector(".appChoice").addEventListener("click", waitForAppBtn.bind(null, dupThis))
}

export function triggerLogout(dupThis)
{
    if (!confirm(dupThis.language.update.confirmLogout))
        return;
    API.logout(1)
}

export function triggerIntraLink(dupThis)
{
    if (localStorage.getItem("intraLinked") == null && confirm(dupThis.language.update.intraLinkConfirm))
    {
        localStorage.setItem("userWantLink", "true");
        window.location.href = dupThis.intraUrl;
    }
    else if (localStorage.getItem("intraLinked") != null && confirm(dupThis.language.update.intraUnlinkConfirm))
    {
        console.log("unlink")
        API.unlinkIntra(1).then(()=>{
            window.location.reload();
        });
    }
}

export function triggerGoogleLink(dupThis)
{
    console.log("heyyyyy")
}

