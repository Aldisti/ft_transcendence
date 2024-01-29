import language from "/language/language.js"
import * as API from "/API/APICall.js"


let lan = language[localStorage.getItem("language")];

function checkFirstName(obj, errMsg)
{
    let firstName = obj.value;
	let firstAndLastNameReg = /^[A-Za-z0-9 -]{1,32}$/
	let msg = errMsg == undefined ? lan.register.flow1Errors[2] : errMsg;
    let flag = true;

    //simply check lastName with a regex coloring the box as needed
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
	
    //simply check lastName with a regex coloring the box as needed
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

    //here inserted date is checked if is greater that "minAge" if not will change color e set the flag as false that will be later returned
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

export function checkChangeInfoForm(form, errors){
    let flag = true;

    //through regex all the filled fields are checked, return true if is all ok false otherwise
    if (!checkFirstName(form[lan.update.firstName[1]], errors != undefined ? errors[lan.update.firstName[1]] : ""))
        flag = false;
    if (!checkLastName(form[lan.update.lastName[1]], errors != undefined ? errors[lan.update.lastName[1]] : ""))
        flag = false;
    if (!checkDate(form[lan.update.birthDate[1]], errors != undefined ? errors[lan.update.birthDate[1]] : ""))
        flag = false;
    return (flag);
}

function passwordMatch(inputObj, confirmNewPass, newPass){

    //if new password match the confirm for new password will change color the input box
    if (confirmNewPass != newPass)
    {
        inputObj.style.backgroundColor = "#A22C29";
        inputObj.style.color = "white"
        document.querySelector(`#${inputObj.id}-tooltip`).innerHTML = "password does not match";
    }
    else
        document.querySelector(`#${inputObj.id}-tooltip`).innerHTML = lan.register.flow1Errors[2];
}

function passwordValidator(password, obj, errors){

    //if password does not match the requirements will change color the input box
    if (password.length > 8 && password.length < 72 && password.match(/[0123456789]/) && password.match(/[!@#$%^&*()_+\-=ˆ\[\]{};:'",.<>?~]/) && password.match(/[QWERTYUIOPASDFGHJKLZXCVBNM]/) && password.match(/[qwertyuiopasdfghjklzxcvbnm]/))
    {
        obj.style.backgroundColor = "#a7c957";
        obj.style.color = "black";
        return (true);
    }

    //otherwise will bring the colors to normal
    errors[obj.id] = true;
    obj.style.backgroundColor = "#A22C29";
    obj.style.color = "white"
    return (false);
}

export function checkChangePasswordForm(form, errors){
    let oldPass = form[lan.update.oldPassword[1]].value;
    let newPass = form[lan.update.newPassword[1]].value
    let confirmNewPass = form[lan.update.confirmNewPassword[1]].value;

    //check for syntax error on all three possible passoword inserted and show requirements if needed
    if (!passwordValidator(oldPass, document.querySelectorAll("input")[0], errors))
        document.querySelector(".errors").style.display = "flex";
    if (!passwordValidator(newPass, document.querySelectorAll("input")[1], errors))
        document.querySelector(".errors").style.display = "flex";
    if (!passwordValidator(confirmNewPass, document.querySelectorAll("input")[2], errors))
        document.querySelector(".errors").style.display = "flex";

    //will color the input box if the new password does not match with the confirm
    passwordMatch(document.querySelectorAll("input")[1], confirmNewPass, newPass);
    passwordMatch(document.querySelectorAll("input")[2], confirmNewPass, newPass);

    //check if any error are present
    if (Object.keys(errors).length > 0)
        return (false);
    return (true);
}

function emailValidator(email, errors)
{
    let regExp  =/(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    if (email.match(regExp) && email != "")
    {
        errors[lan.update.email[1]] = lan.register.flow1Errors[2];
        return true;
    }
    errors[lan.update.email[1]] = lan.register.flow1Errors[3];
    return false
}

export async function checkChangeEmailForm(fields, errors){
    let tooltip = document.querySelector(`#${lan.update.email[1]}-tooltip`);
    if (!emailValidator(fields[lan.update.email[1]].value, errors))
    {
        fields[lan.update.email[1]].style.backgroundColor = "#A22C29";
        fields[lan.update.email[1]].style.color = "white"
        tooltip.innerHTML = lan.register.flow1Errors[3];
        return (false);
    }

    let res = await API.checkForEmailAvailability(fields[lan.update.email[1]].value);
    if (res)
    {
        fields[lan.update.email[1]].style.backgroundColor = "#a7c957"
        fields[lan.update.email[1]].style.color = "black"
        tooltip.innerHTML = lan.register.flow1Errors[2];
        return (true);
    }
    fields[lan.update.email[1]].style.backgroundColor = "#A22C29";
    fields[lan.update.email[1]].style.color = "white"
    tooltip.innerHTML = lan.register.flow1Errors[1];
    return (false);
}