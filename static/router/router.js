import Router from "/router/mainRouterFunc.js"
import * as styleH from "/router/styleSheetsHandling.js"

localStorage.setItem("language", "en")

const navigateTo = url => {
	history.pushState(null, null, url);
	Router();
};

// define the behaviour when clicking links making them internal routing
document.addEventListener("click", (e)=>{
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