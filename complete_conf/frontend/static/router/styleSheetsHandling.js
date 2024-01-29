import Routes from "/router/initRoutes.js"

export function disableStyleSheet(fRoute)
{
	let toFind;

	if (localStorage.getItem("style") == "old")
		toFind = fRoute.style;
	else
		toFind = fRoute.modernStyle;
	for (let style of document.querySelectorAll(".cssView"))
	{
		if (fRoute != 0 && style.href.indexOf(toFind) != -1)
			style.disabled = true;
	}
}

export function enableStyleSheet(fRoute)
{
	let toFind;

	if (localStorage.getItem("style") == "old")
		toFind = fRoute.style;
	else
		toFind = fRoute.modernStyle;
	for (let style of document.querySelectorAll(".cssView"))
	{
		if (fRoute != 0 && style.href.indexOf(toFind) != -1)
		{
			style.disabled = false;
		}
	}
}

export function loadStyles()
{
	for (let route of Routes)
	{
		let link = document.createElement("link");
		
		link.type = "text/css";
		link.rel = "stylesheet";
		link.classList.add("cssView");
		link.disabled = true;
		link.href = route.style;
		document.head.appendChild(link);
		link = document.createElement("link");
		
		link.type = "text/css";
		link.rel = "stylesheet";
		link.classList.add("cssView");
		link.disabled = true;
		link.href = route.modernStyle;
		document.head.appendChild(link);
	}
}