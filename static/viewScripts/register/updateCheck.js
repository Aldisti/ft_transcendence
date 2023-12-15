import language from "/language/language.js"

let lan = language[localStorage.getItem("language")];

function checkFirstName(firstName, obj)
{
	let firstAndLastNameReg = /^[A-Za-z0-9 -]{1,32}$/
	let msg = lan.register.flow1Errors[2];
	
	if (!firstAndLastNameReg.test(firstName))
    {
        obj.style.backgroundColor = "#A22C29";
        obj.style.color = "white"
		msg = lan.register.flow1Errors[5];
    }
    else
    {
        obj.style.backgroundColor = "#a7c957"
        obj.style.color = "black"
    }
	document.querySelector(`#${lan.update.firstName[1]}-tooltip`).innerHTML = msg;
}


function checkLastName(lastName, obj)
{
	let firstAndLastNameReg = /^[A-Za-z0-9 -]{1,32}$/
	let msg = lan.register.flow1Errors[2];
	
	if (!firstAndLastNameReg.test(lastName))
    {
        obj.style.backgroundColor = "#A22C29";
        obj.style.color = "white"
		msg = lan.register.flow1Errors[5];
    }
    else
    {
        obj.style.backgroundColor = "#a7c957"
        obj.style.color = "black"
    }
	document.querySelector(`#${lan.update.lastName[1]}-tooltip`).innerHTML = msg;
}

function checkDate(date, obj)
{
	const splitted = date.split("-");
	let msg = lan.register.flow1Errors[2];
	let minAge = 16;

    if (!(new Date(Number(splitted[0]) + minAge, Number(splitted[1])-1, Number(splitted[2])) <= new Date()))
    {
        obj.style.backgroundColor = "#A22C29";
        obj.style.color = "white"
		msg = minAge + " " + lan.register.flow2Errors[0];
    }
    else
    {
        obj.style.backgroundColor = "#a7c957"
        obj.style.color = "black"
    }
	document.querySelector(`#${lan.update.birthDate[1]}-tooltip`).innerHTML = msg;
}

export function checkInfo(form){

	for (let key of Object.keys(form))
	{
		if (key == lan.update.firstName[1])
			checkFirstName(form[key].value, form[key]);
		else if (key == lan.update.lastName[1])
			checkLastName(form[key].value, form[key]);
		else if (key == lan.update.birthDate[1])
			checkDate(form[key].value, form[key]);
	}
}

export function checkPassword(){

}