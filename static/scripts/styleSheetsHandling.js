import Routes from "/scripts/initRoutes.js"

let baseCss = ["style.css", "/style/bootstrap.min.css", "https://fonts.googleapis.com/css2?family=VT323&display=swap"];

export function disableStyleSheet(fRoute)
{
	for (let style of document.styleSheets)
	{
		if (fRoute != 0 && style.href.indexOf(fRoute.style) != -1 && !isBase(style.href))
			style.disabled = true;
	}
}

export function enableStyleSheet(fRoute)
{
	for (let style of document.styleSheets)
	{
		if (fRoute != 0 && style.href.indexOf(fRoute.style) != -1 && !isBase(style.href))
			style.disabled = false;
	}
}

export function isBase(url)
{
	for (let singleUrl of baseCss)
	{
		if (url.indexOf(singleUrl) != -1)
			return true
	}
	return false
}
export function loadStyles()
{
	for (let route of Routes)
	{
		let link = document.createElement("link");
		
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = route.style;
		document.head.appendChild(link);
	}
}