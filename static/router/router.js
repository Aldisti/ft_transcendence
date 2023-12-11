import Router from "/router/mainRouterFunc.js"
import * as styleH from "/router/styleSheetsHandling.js"

if (localStorage.getItem("language") == null)
	localStorage.setItem("language", "en")
else
	document.querySelector("#languageSwitch").value = localStorage.getItem("language")

if (localStorage.getItem("style") == null)
	localStorage.setItem("style", "old")

const navigateTo = url => {
	history.pushState(null, null, url);
	Router();
};

// define the behaviour when clicking links making them internal routing
document.addEventListener("click", (e)=>{
	if (e.target.id == "timeTravel")
	{
		if (localStorage.getItem("style") == "old")
			localStorage.setItem("style", "modern")
		else
			localStorage.setItem("style", "old")
		window.location.reload();
	}
	if (e.target.matches("[data-link]"))
	{
		e.preventDefault();
		navigateTo(e.target.href);
	}
})

//make the back key works
window.addEventListener("popstate", Router);

document.querySelector("#languageSwitch").addEventListener("change", (e)=>{
	localStorage.setItem("language", e.target.value)
	window.location.reload()
})

addEventListener("DOMContentLoaded", (event) => {
	styleH.loadStyles();
	Router();
});