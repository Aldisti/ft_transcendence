import Router from "/scripts/mainRouterFunc.js"
import * as styleH from "/scripts/styleSheetsHandling.js"

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

addEventListener("DOMContentLoaded", (event) => {
	styleH.loadStyles();
	Router();
});