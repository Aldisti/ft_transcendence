import * as isAlreadyRegistered from "/API/checkUser.js"
import language from "/language/language.js"

let lan = language[localStorage.getItem("language")];

export function setupSwitchListener(){
    document.querySelector(".passwordSwitch").addEventListener("click", (e)=>{
        if (e.target.parentNode.parentNode.children[0].type == "password")
        {
            e.target.parentNode.parentNode.children[0].type = "text";
            e.target.src = "/imgs/closedEye.png"
        }
        else
        {
            e.target.parentNode.parentNode.children[0].type = "password";
            e.target.src = "/imgs/openEye.png"
        }
    })
    document.querySelector(".confirmPasswordSwitch").addEventListener("click", (e)=>{
        if (e.target.parentNode.parentNode.children[0].type == "password")
        {
            e.target.parentNode.parentNode.children[0].type = "text";
            e.target.src = "/imgs/closedEye.png"
        }
        else
        {
            e.target.parentNode.parentNode.children[0].type = "password";
            e.target.src = "/imgs/openEye.png"
        }
    })
}

function passwordValidator(password, errors, toBeTrue){
    if (password.length > 8 && password.length < 72 && password.match(/[0123456789]/) && password.match(/[!@#$%^&*()_+\-=ˆ\[\]{};:'",.<>?~]/) && password.match(/[QWERTYUIOPASDFGHJKLZXCVBNM]/) && password.match(/[qwertyuiopasdfghjklzxcvbnm]/))
        errors[toBeTrue].isValid = false;
    else
        errors[toBeTrue].isValid = true;
}

function dateValidator(date, errors)
{
    const splitted = date.split("-");

    if (!(new Date(Number(splitted[0])+18, Number(splitted[1])-1, Number(splitted[2])) <= new Date()))
        errors.birthDate.isValid = true;
    else
        errors.birthDate.isValid = false;
}

function emailValidator(email, errors)
{
    let regExp  =/(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    if (email.match(regExp))
    {
        errors.email.isValid = false;
        if (errors.email.text.indexOf(lan.register.flow1Errors[3]) != -1)
            errors.email.text = errors.email.text.replace(`${lan.register.flow1Errors[3]}<br>`, "")
    }
    else
    {
        errors.email.isValid = true;
        if (errors.email.text.indexOf(lan.register.flow1Errors[3]) == -1 && email != "")
            errors.email.text = lan.register.flow1Errors[3];
    }
}

function doPaint(errors, key, obj)
{
    if (errors[key].isValid == true)
        obj.style.backgroundColor = "red";
    else
        obj.style.backgroundColor = "green"
    if ((key == "password" || key == "confirmPassword") && errors[key].isValid == true)
        document.querySelector(".errors").style.display = "flex"
}


function paintBoxes(list, errors)
{
    for (let el of list)
    {
        for (let key of Object.keys(errors))
        {
            if ((el.name == "password" && key == "password") || (el.name == "confirmPassword" && key == "confirmPassword"))
                doPaint(errors, key, el.parentNode.parentNode)
            else if (el.name == key)
                doPaint(errors, key, el.parentNode)
        }
    }
}

function setSpecialErrors(status, errors, key, field){
    if (status && field != "" && !(key == "email" && errors.email.isValid))
        errors[key].isValid = false;
    if (!status)
    {
        errors[key].isValid = true;
        if (errors[key].text.indexOf(`${key} ${lan.register.flow1Errors[1]}`) == -1)
            errors[key].text = `${key} ${lan.register.flow1Errors[1]}<br>`;
    }
    else
    {
        if (errors[key].text.indexOf(`${key} ${lan.register.flow1Errors[1]}`) != -1)
            errors[key].text = errors[key].text.replace(`${key} ${lan.register.flow1Errors[1]}<br>`, "")
    }
}

function tooltipUpdater(errors){
    let tooltips = document.querySelectorAll(".tooltiptext");

    for (let tooltip of tooltips)
    {
        if (errors[tooltip.id.split("-")[0]].text == "")
            tooltip.innerHTML = lan.register.flow1Errors[2];
        else
            tooltip.innerHTML = errors[tooltip.id.split("-")[0]].text;
    }
}

export async function flow1Check(fields, errors, objList){

    //basic check for empty parameters
    for (let key of Object.keys(fields))
    {
        if ((key == "firstName" || key == "lastName" || key == "username" || key == "email") && fields[key] == "")
        {
            errors[key].isValid = true;
            if (errors[key].text.indexOf(`${lan.register.flow1Errors[0]}`) == -1)
                errors[key].text = `${lan.register.flow1Errors[0]}<br>`;
        }
        else
        {
            errors[key].isValid = false;
            errors[key].text = errors[key].text.replace(`${lan.register.flow1Errors[0]}<br>`, "");
        }
    }

    //validate email with regex
    emailValidator(fields.email, errors);

    //asking server for email and user availability
    let resUsername  = await isAlreadyRegistered.checkUser(fields.username);
    let resEmail  = await isAlreadyRegistered.checkEmail(fields.email);

    //setting error if needed
    setSpecialErrors(resUsername, errors, "username", fields.username);
    setSpecialErrors(resEmail, errors, "email", fields.email);
    paintBoxes(objList, errors);

    tooltipUpdater(errors)

    //defining returns
    for (let key of Object.keys(errors))
    {
        if (errors[key].isValid == true)
            return (false);
    }
    return (true);
}

export function flow2Check(fields, errors, objList){
    dateValidator(fields.birthDate, errors);
    //space left for image check now empty
    paintBoxes(objList, errors)
    for (let key of Object.keys(errors))
    {
        if (errors[key].isValid == true)
            return false;
    }
    return (true);
}

export function flow3Check(fields, errors, objList){
    passwordValidator(fields.password, errors, "password");
    passwordValidator(fields.confirmPassword, errors, "confirmPassword");
    if (fields.password != fields.confirmPassword)
    {
        errors.password.isValid = true;
        errors.confirmPassword.isValid = true;
    }
    paintBoxes(objList, errors)
    for (let key of Object.keys(errors))
    {
        if (errors[key].isValid == true)
            return false;
    }
    return (true);
}