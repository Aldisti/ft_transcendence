import Routes from "/scripts/initRoutes.js"
import Router from "/scripts/mainRouterFunc.js"

const navigateTo = url => {
	history.pushState(null, null, url);
	Router();
};

for (let route of Routes)
{
	let temp = new route.view;
	document.querySelector("head").innerHTML = document.querySelector("head").innerHTML + temp.getHeader(route.style);
}

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

Router();