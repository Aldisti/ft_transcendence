import Routes from "/scripts/initRoutes.js"
import * as styleH from "/scripts/styleSheetsHandling.js"

let fRoute = 0;

for (let style of document.styleSheets)
{
	if (!styleH.isBase(style.href))
		style.disabled = true;
}

const Router =()=>{
	let matechedLocation = 0;
	
	if (fRoute == 0)
		styleH.loadStyles();
	styleH.disableStyleSheet(fRoute);
	console.log(document.styleSheets)
	for (let route of Routes)
	{
		//if found set lastClass to delete previus css and set matchedLocation to update the new html
		if (route.path == location.pathname)
		{
			matechedLocation = new route.view;
			fRoute = route;
			break ;
		}
	}
	//if no path match the '/' is setted
	if (matechedLocation == 0)
	{
		matechedLocation = new Routes[0].view;
		fRoute = Routes[0];
	}
	styleH.enableStyleSheet(fRoute);
	document.querySelector("#app").innerHTML = matechedLocation.getHtml();
	matechedLocation.setBackground();
	
	//setup the listener for submit button
	if (matechedLocation.needListener)
	{
		document.querySelector("#" + matechedLocation.listenerId).addEventListener("click", ()=>{
			console.log(matechedLocation.getInput());
		})
	}
}

export default Router