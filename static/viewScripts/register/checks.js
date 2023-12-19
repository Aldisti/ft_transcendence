import * as API from "/API/APICall.js"
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

function dateValidator(date, errors, minAge)
{
    const splitted = date.split("-");

    if (!(new Date(Number(splitted[0]) + minAge, Number(splitted[1])-1, Number(splitted[2])) <= new Date()))
    {
        errors[lan.register.birthDate[1]].isNotValid = true;
        errors[lan.register.birthDate[1]].text = minAge + " " + lan.register.flow2Errors[0];
    }
    else
    {
        errors[lan.register.birthDate[1]].isNotValid = false;
        errors[lan.register.birthDate[1]].text = lan.register.flow2Errors[1];
    }
}

function emailValidator(email, errors)
{
    let regExp  =/(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    if (email.match(regExp) && email != "")
    {
        errors[lan.register.email[1]].isNotValid = false;
        errors[lan.register.email[1]].text = lan.register.flow1Errors[2];
        return true;
    }
    else
    {
        errors[lan.register.email[1]].isNotValid = true;
        errors[lan.register.email[1]].text = lan.register.flow1Errors[3];
    }
    return false
}

function doPaint(errors, key, obj)
{
    if (errors[key].isNotValid == true)
    {
        obj.style.backgroundColor = "#A22C29";
        obj.style.color = "white" 
    }
    else
    {
        obj.style.backgroundColor = "#a7c957"
        obj.style.color = "black" 
    }
    if ((key == lan.register.password[1] || key == lan.register.confirmPassword[1]) && errors[key].isNotValid == true)
        document.querySelector(".errors").style.display = "flex"
}


export function showErrors(list, errors)
{
    let tooltips = document.querySelectorAll(".tooltiptext");

    for (let el of list)
    {
        for (let key of Object.keys(errors))
        {
            if ((el.name == lan.register.password[1] && key == lan.register.password[1]) || (el.name == lan.register.confirmPassword[1] && key == lan.register.confirmPassword[1]))
                doPaint(errors, key, el)
            else if (el.name == key)
                doPaint(errors, key, el)
        }
    }
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
        errors[lan.register.username[1]].text = lan.register.flow1Errors[4];
        return (false);
    }
    else
    {
        errors[lan.register.username[1]].isNotValid = false;
        errors[lan.register.username[1]].text = lan.register.flow1Errors[2];
    }
    return (true);
}

async function checkUsername(username, errors)
{
    let resUsername;

    //first check the username with regex expression the if is ok ask to server to check availability
    if (usernameValidator(username, errors))
        resUsername  = await API.checkForUsernameAvailability(username);
    else
        return ;
    if (resUsername.status == 404 && username != "" && usernameValidator(username, errors))
    {
        errors[lan.register.username[1]].isNotValid = false;
        errors[lan.register.username[1]].text = "";
    }
    if (resUsername.status == 200)
    {
        errors[lan.register.username[1]].isNotValid = true;
        errors[lan.register.username[1]].text = `${lan.register.username[1]} ${lan.register.flow1Errors[1]}`;
    }
}

async function checkEmail(email, errors)
{
    let resEmail;

    //first check the email with regex expression the if is ok ask to server to check availability
    if (emailValidator(email, errors))
        resEmail  = await API.checkForEmailAvailability(email);
    else
        return ;
    if (resEmail.status == 404 && email != "" && emailValidator(email, errors))
    {
        errors[lan.register.email[1]].isNotValid = false;
        errors[lan.register.email[1]].text = "";
    }
    if (resEmail.status == 200)
    {
        errors[lan.register.email[1]].isNotValid = true;
        errors[lan.register.email[1]].text = `${lan.register.email[1]} ${lan.register.flow1Errors[1]}`;
    }
}

function firstNameValidator(firstName, errors)
{
    let firstNameReg = /^[A-Za-z0-9 -]{1,32}$/
    
    if (!firstNameReg.test(firstName))
    {
        errors[lan.register.firstName[1]].isNotValid = true;
        errors[lan.register.firstName[1]].text = lan.register.flow1Errors[5]
    }
    else if (firstName != "")
    {
        errors[lan.register.firstName[1]].isNotValid = false;
        errors[lan.register.firstName[1]].text = lan.register.flow1Errors[2]
    }
}

function lastNameValidator(lastName, errors)
{
    let lastNameReg = /^[A-Za-z0-9 -]{1,32}$/
    
    if (!lastNameReg.test(lastName))
    {
        errors[lan.register.lastName[1]].isNotValid = true;
        errors[lan.register.lastName[1]].text = lan.register.flow1Errors[5]
    }
    else if (lastName != "")
    {
        errors[lan.register.lastName[1]].isNotValid = false;
        errors[lan.register.lastName[1]].text = lan.register.flow1Errors[2]
    }
}

export async function flow1Check(fields, errors, objList){
    //check first and last name with regex
    firstNameValidator(fields[lan.register.firstName[1]], errors)
    lastNameValidator(fields[lan.register.lastName[1]], errors)

    //check email and username for bad character with regex and availability with fetch
    await checkUsername(fields[lan.register.username[1]], errors);
    await checkEmail(fields[lan.register.email[1]], errors);

    //apply error in ui where needed
    showErrors(objList, errors);

    //defining returns
    for (let key of [lan.register.firstName[1], lan.register.lastName[1], lan.register.username[1], lan.register.email[1]])
    {
        if (errors[key].isNotValid == true)
            return (false);
    }
    return (true);
}

export function flow2Check(fields, errors, objList){
    let minAge = 16;

    dateValidator(fields[lan.register.birthDate[1]], errors, minAge);
    //space left for image check now empty
    showErrors(objList, errors)
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
    showErrors(objList, errors)
    for (let key of [lan.register.password[1], lan.register.confirmPassword[1]])
    {
        if (errors[key].isNotValid == true)
            return false;
    }
    return (true);
}