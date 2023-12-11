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
        errors[toBeTrue].isNotValid = false;
    else
        errors[toBeTrue].isNotValid = true;
}

function dateValidator(date, errors)
{
    const splitted = date.split("-");

    if (!(new Date(Number(splitted[0])+18, Number(splitted[1])-1, Number(splitted[2])) <= new Date()))
        errors[lan.register.birthDate[1]].isNotValid = true;
    else
        errors[lan.register.birthDate[1]].isNotValid = false;
}

function emailValidator(email, errors)
{
    let regExp  =/(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    if (email.match(regExp))
    {
        errors[lan.register.email[1]].isNotValid = false;
        if (errors[lan.register.email[1]].text.indexOf(lan.register.flow1Errors[3]) != -1)
            errors[lan.register.email[1]].text = errors[lan.register.email[1]].text.replace(`${lan.register.flow1Errors[3]}<br>`, "")
    }
    else
    {
        errors[lan.register.email[1]].isNotValid = true;
        if (errors[lan.register.email[1]].text.indexOf(lan.register.flow1Errors[3]) == -1 && email != "")
            errors[lan.register.email[1]].text = lan.register.flow1Errors[3];
    }
}

function doPaint(errors, key, obj)
{
    if (errors[key].isNotValid == true)
        obj.style.backgroundColor = "red";
    else
        obj.style.backgroundColor = "white"
    if ((key == lan.register.password[1] || key == lan.register.confirmPassword[1]) && errors[key].isNotValid == true)
        document.querySelector(".errors").style.display = "flex"
    if (errors[key].isNotValid)
        document.querySelector(`#${key}-tooltip`).innerHTML = errors[key].text;
}


export function paintBoxes(list, errors)
{
    for (let el of list)
    {
        for (let key of Object.keys(errors))
        {
            if ((el.name == lan.register.password[1] && key == lan.register.password[1]) || (el.name == lan.register.confirmPassword[1] && key == lan.register.confirmPassword[1]))
                doPaint(errors, key, el.parentNode.parentNode)
            else if (el.name == key)
                doPaint(errors, key, el.parentNode)
        }
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

function usernameValidator(username, errors)
{
    let usernameReg = /^[A-Za-z0-9!?*@$~_-]{5,32}$/
    
    if (!usernameReg.test(username))
    {
        errors[lan.register.username[1]].isNotValid = true;
        errors[lan.register.username[1]].text = "bad character inserted. Allowed ones are: A-Za-z0-9!?*@$~_-";
        return (false);
    }
    else
    {
        errors[lan.register.username[1]].isNotValid = false;
    }
    return (true);
}

function checkUsername(username, errors, res)
{
    if (res.status == 404 && username != "" && usernameValidator(username, errors))
    {
        errors[lan.register.username[1]].isNotValid = false;
        errors[lan.register.username[1]].text = "";
    }
    if (res.status == 200)
    {
        errors[lan.register.username[1]].isNotValid = true;
        if (errors[lan.register.username[1]].text.indexOf(`${lan.register.username[1]} ${lan.register.flow1Errors[1]}`) == -1)
            errors[lan.register.username[1]].text = `${lan.register.username[1]} ${lan.register.flow1Errors[1]}<br>`;
    }
}

function checkEmail(email, errors, res)
{
    if (res.status == 404 && email != "" && emailValidator(email, errors))
    {
        errors[lan.register.email[1]].isNotValid = false;
        errors[lan.register.email[1]].text = "";
    }
    if (res.status == 200)
    {
        errors[lan.register.email[1]].isNotValid = true;
        if (errors[lan.register.email[1]].text.indexOf(`${lan.register.email[1]} ${lan.register.flow1Errors[1]}`) == -1)
            errors[lan.register.email[1]].text = `${lan.register.email[1]} ${lan.register.flow1Errors[1]}<br>`;
    }
}



function firstAndLastNameValidator(firstName, lastName, errors)
{
    let firstNameReg = /^[A-Za-z0-9 -]{1,32}$/
    let lastNameReg = /^[A-Za-z0-9 -]{1,32}$/

    if (!firstNameReg.test(firstName) && firstName != "")
    {
        errors[lan.register.firstName[1]].isNotValid = true;
        errors[lan.register.firstName[1]].text = "allowed character are: A-Za-z0-9 -"
    }
    else if (firstName != "")
    {
        errors[lan.register.firstName[1]].isNotValid = false;
        errors[lan.register.firstName[1]].text = "Come back when you are in trouble"
    }
    if (!lastNameReg.test(lastName) && lastName != "")
    {
        errors[lan.register.lastName[1]].isNotValid = true;
        errors[lan.register.lastName[1]].text = "allowed character are: A-Za-z0-9 -"
    }
    else if (lastName != "")
    {
        errors[lan.register.lastName[1]].isNotValid = false;
        errors[lan.register.lastName[1]].text = "Come back when you are in trouble"
    }
    if (firstName == "")
    {
        errors[lan.register.firstName[1]].isNotValid = true;
        errors[lan.register.firstName[1]].text = "cannot be blank"
    }
    if (lastName == "")
    {
        errors[lan.register.lastName[1]].isNotValid = true;
        errors[lan.register.lastName[1]].text = "cannot be blank"
    }
}

export async function flow1Check(fields, errors, objList){

    //basic check for empty parameters
    for (let key of [lan.register.firstName[1], lan.register.lastName[1], lan.register.username[1], lan.register.email[1]])
    {
        if (fields[key] == "")
        {
            errors[key].isNotValid = true;
            if (errors[key].text.indexOf(`${lan.register.flow1Errors[0]}`) == -1)
                errors[key].text = `${lan.register.flow1Errors[0]}<br>`;
        }
        else
        {
            errors[key].isNotValid = false;
            errors[key].text = errors[key].text.replace(`${lan.register.flow1Errors[0]}<br>`, "");
        }
    }

    //validate email with regex
    emailValidator(fields[lan.register.email[1]], errors);

    //asking server for email and user availability
    let resUsername  = await isAlreadyRegistered.checkUser(fields[lan.register.username[1]]);
    let resEmail  = await isAlreadyRegistered.checkEmail(fields[lan.register.email[1]]);

    //setting error if needed
    checkUsername(fields[lan.register.username[1]], errors, resUsername);
    checkEmail(fields[lan.register.email[1]], errors, resEmail);

    firstAndLastNameValidator(fields[lan.register.firstName[1]], fields[lan.register.lastName[1]], errors);
    tooltipUpdater(errors)
    paintBoxes(objList, errors);


    //defining returns
    for (let key of [lan.register.firstName[1], lan.register.lastName[1], lan.register.username[1], lan.register.email[1]])
    {
        if (errors[key].isNotValid == true)
            return (false);
    }
    return (true);
}

export function flow2Check(fields, errors, objList){
    dateValidator(fields[lan.register.birthDate[1]], errors);
    //space left for image check now empty
    paintBoxes(objList, errors)
    for (let key of [lan.register.birthDate[1], lan.register.profilePicture[1]])
    {
        if (errors[key].isNotValid == true)
            return false;
    }
    return (true);
}

export function flow3Check(fields, errors, objList){
    passwordValidator(fields[lan.register.password[1]], errors, lan.register.password[1]);
    passwordValidator(fields[lan.register.confirmPassword[1]], errors, lan.register.confirmPassword[1]);
    if (fields[lan.register.password[1]] != fields[lan.register.confirmPassword[1]])
    {
        errors[lan.register.password[1]].isNotValid = true;
        errors[lan.register.confirmPassword[1]].isNotValid = true;
    }
    paintBoxes(objList, errors)
    for (let key of [lan.register.password[1], lan.register.confirmPassword[1]])
    {
        if (errors[key].isNotValid == true)
            return false;
    }
    return (true);
}