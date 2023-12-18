import language from "/language/language.js"

let lan = language[localStorage.getItem("language")];

function checkFirstName(obj, errMsg)
{
    let firstName = obj.value;
	let firstAndLastNameReg = /^[A-Za-z0-9 -]{1,32}$/
	let msg = errMsg == undefined ? lan.register.flow1Errors[2] : errMsg;
    let flag = true;
	
	if (!firstAndLastNameReg.test(firstName) || errMsg != undefined)
    {
        obj.style.backgroundColor = "#A22C29";
        obj.style.color = "white"
        flag = false;
        if (!firstAndLastNameReg.test(firstName))
		    msg = lan.register.flow1Errors[5];
    }
    else
    {
        obj.style.backgroundColor = "#a7c957"
        obj.style.color = "black"
    }
	document.querySelector(`#${lan.update.firstName[1]}-tooltip`).innerHTML = msg;
    return (flag);
}


function checkLastName(obj, errMsg)
{
    let lastName = obj.value;
	let firstAndLastNameReg = /^[A-Za-z0-9 -]{1,32}$/
	let msg = errMsg == undefined ? lan.register.flow1Errors[2] : errMsg;
    let flag = true;
	
	if (!firstAndLastNameReg.test(lastName) || errMsg != undefined)
    {
        obj.style.backgroundColor = "#A22C29";
        obj.style.color = "white"
        flag = false;
        if (!firstAndLastNameReg.test(lastName))
		    msg = lan.register.flow1Errors[5];
    }
    else
    {
        obj.style.backgroundColor = "#a7c957"
        obj.style.color = "black"
    }
	document.querySelector(`#${lan.update.lastName[1]}-tooltip`).innerHTML = msg;
    return (flag);
}

function checkDate(obj, errMsg)
{
    let date = obj.value;
	const splitted = date.split("-");
	let msg = errMsg == undefined ? lan.register.flow2Errors[1] : errMsg;
	let minAge = 16;
    let flag = true;

    if (!(new Date(Number(splitted[0]) + minAge, Number(splitted[1])-1, Number(splitted[2])) <= new Date()) || errMsg != undefined)
    {
        obj.style.backgroundColor = "#A22C29";
        obj.style.color = "white"
        flag = false;
        if (!(new Date(Number(splitted[0]) + minAge, Number(splitted[1])-1, Number(splitted[2])) <= new Date()))
		    msg = minAge + " " + lan.register.flow2Errors[0];
    }
    else
    {
        obj.style.backgroundColor = "#a7c957"
        obj.style.color = "black"
    }
	document.querySelector(`#${lan.update.birthDate[1]}-tooltip`).innerHTML = msg;
    return (flag);
}

function passwordValidator(password, obj, errors){
    if (password.length > 8 && password.length < 72 && password.match(/[0123456789]/) && password.match(/[!@#$%^&*()_+\-=ˆ\[\]{};:'",.<>?~]/) && password.match(/[QWERTYUIOPASDFGHJKLZXCVBNM]/) && password.match(/[qwertyuiopasdfghjklzxcvbnm]/))
    {
        obj.style.backgroundColor = "#a7c957";
        obj.style.color = "black";
        return (true);
    }
    errors[obj.id] = true;
    obj.style.backgroundColor = "#A22C29";
    obj.style.color = "white"
    return (false);
}

export function checkInfo(form, errors){
    let flag = true;

    if (!checkFirstName(form[lan.update.firstName[1]], errors[lan.update.firstName[1]]))
        flag = false;
    if (!checkLastName(form[lan.update.lastName[1]], errors[lan.update.lastName[1]]))
        flag = false;
    if (!checkDate(form[lan.update.birthDate[1]], errors[lan.update.birthDate[1]]))
        flag = false;
    return (flag);
}

function passwordMatch(inputObj, confirmNewPass, newPass){
    if (confirmNewPass != newPass)
    {
        inputObj.style.backgroundColor = "#A22C29";
        inputObj.style.color = "white"
        document.querySelector(`#${inputObj.id}-tooltip`).innerHTML = "password does not match";
    }
    else
        document.querySelector(`#${inputObj.id}-tooltip`).innerHTML = lan.register.flow1Errors[2];
}

export function checkPassword(form, errors){
    let oldPass = form[lan.update.oldPassword[1]].value;
    let newPass = form[lan.update.newPassword[1]].value
    let confirmNewPass = form[lan.update.confirmNewPassword[1]].value;

    if (!passwordValidator(oldPass, document.querySelectorAll("input")[0], errors))
        document.querySelector(".errors").style.display = "flex";
    if (!passwordValidator(newPass, document.querySelectorAll("input")[1], errors))
        document.querySelector(".errors").style.display = "flex";
    if (!passwordValidator(confirmNewPass, document.querySelectorAll("input")[2], errors))
        document.querySelector(".errors").style.display = "flex";

    passwordMatch(document.querySelectorAll("input")[1], confirmNewPass, newPass);
    passwordMatch(document.querySelectorAll("input")[2], confirmNewPass, newPass);
    if (Object.keys(errors).length > 0)
        return (false);
    return (true);
}