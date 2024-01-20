import Router from "/router/mainRouterFunc.js"
import * as styleH from "/router/styleSheetsHandling.js"

if (localStorage.getItem("style") == null)
	localStorage.setItem("style", "modern")

const navigateTo = url => {
	history.pushState(null, null, url);
	Router();
};

if (localStorage.getItem("style") == "modern")
	document.querySelector(".baseStyle").href = "/style/modern/style.css"
else
	document.querySelector(".baseStyle").href = "/style/style.css"


// define the behaviour when clicking links making them internal routing
document.addEventListener("click", (e)=>{
	if (e.target.id == "timeTravel" || e.target.parentNode.id == "timeTravel")
	{
		if (localStorage.getItem("style") == "old")
			localStorage.setItem("style", "modern")
		else
			localStorage.setItem("style", "old")
		window.location.reload();
	}
	if (e.target.matches("[data-link]") || e.target.parentNode.matches("[data-link]"))
	{
		e.preventDefault();
		if (e.target.parentNode.matches("[data-link]"))
			navigateTo(e.target.parentNode.href);
		else
			navigateTo(e.target.href);
	}
})

//make the back key works
window.addEventListener("popstate", Router);

addEventListener("DOMContentLoaded", (event) => {
	styleH.loadStyles();
	Router();
});