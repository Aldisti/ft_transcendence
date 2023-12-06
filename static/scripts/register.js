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

function baseCheck(data, errors){
    let regExp  =/(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    
    for (let key of Object.keys(data))
    {
        if (key == "email" && !data[key].match(regExp))
        {
            errors[key] = true;
            continue ;
        }
        if (data[key] == "")
            errors[key] = true;
        else
            errors[key] = false;
    }
}

function thereIsErrors(errors, len)
{
    let counter = 0;

    for (let key of Object.keys(errors))
    {
        if (counter >= len)
            break ;
        if (errors[key])
            return true
        counter++;
    }
    return false;
}


export function firstCheck(data, errors)
{
    baseCheck(data, errors);
    if (thereIsErrors(errors, 4))
        return true
    return false;
}

function passwordValidator(password, errors, toBeTrue){
    if (password.length > 8 && password.match(/[0123456789]/) && password.match(/[!@#$%^&*()_+\-=ˆ\[\]{};:'",.<>?~]/) && password.match(/[QWERTYUIOPASDFGHJKLZXCVBNM]/))
        errors[toBeTrue] = false;
    else
        errors[toBeTrue] = true;
}
export function checkPassword(data, errors)
{
    baseCheck(data, errors);
    passwordValidator(data.password, errors, "password");
    passwordValidator(data.confirmPassword, errors, "confirmPassword");
    if (data.password != data.confirmPassword)
    {
        errors.password = true;
        errors.confirmPassword = true;
    }
    if (thereIsErrors(errors, 6))
        return true
    return false;
}

export function lastCheck(data, errors)
{
    const splitted = data.birthDate.split("-");

    baseCheck(data, errors);
    passwordValidator(data.password, errors, "password");
    passwordValidator(data.confirmPassword, errors, "confirmPassword");
    if (data.password != data.confirmPassword)
    {
        errors.password = true;
        errors.confirmPassword = true;
    }
    if (!(new Date(Number(splitted[0])+18, Number(splitted[1])-1, Number(splitted[2])) <= new Date()))
        errors.birthDate = true;
    else
        errors.birthDate = false;
    if (thereIsErrors(errors, 8))
        return true;
    return (false);
}