import Routes from "/scripts/initRoutes.js"

export function disableStyleSheet(fRoute)
{
	for (let style of document.querySelectorAll(".cssView"))
	{
		if (fRoute != 0 && style.href.indexOf(fRoute.style) != -1)
			style.disabled = true;
	}
}

export function enableStyleSheet(fRoute)
{
	for (let style of document.querySelectorAll(".cssView"))
	{
		if (fRoute != 0 && style.href.indexOf(fRoute.style) != -1)
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
	}
}