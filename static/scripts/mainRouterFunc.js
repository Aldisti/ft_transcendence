import Routes from "/scripts/initRoutes.js"
import * as styleH from "/scripts/styleSheetsHandling.js"
import Spinner from "/views/Spinner.js"

let fRoute = 0;

const Router =()=>{
	let matechedLocation = 0;

	styleH.disableStyleSheet(fRoute);
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
	document.querySelector("#app").innerHTML = "";
	setTimeout(() => {
		document.querySelector("#app").innerHTML = matechedLocation.getHtml();
		if (matechedLocation.needListener)
		{
			document.querySelector("#" + matechedLocation.listenerId).addEventListener("click", ()=>{
				console.log(matechedLocation.getInput());
			})
		}
		matechedLocation.setBackground();
	}, 50);
	
	//setup the listener for submit button
}

export default Router