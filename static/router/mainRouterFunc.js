import Routes from "/router/initRoutes.js"
import * as styleH from "/router/styleSheetsHandling.js"
import Spinner from "/views/Spinner.js"

let fRoute = 0;
let cloneDocument = document.cloneNode(true);

const Router =()=>{
	document.querySelector(".loaderOverlay").style.left = "0";
	setTimeout(() => {
		let matechedLocation = 0;
	
		styleH.disableStyleSheet(fRoute);
		for (let route of Routes)
		{
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
		matechedLocation.getLanguage();
		styleH.enableStyleSheet(fRoute);
		setTimeout(() => {
			document.querySelector("#app").innerHTML = matechedLocation.getHtml();
			matechedLocation.setup();
			document.querySelector(".loaderOverlay").style.left = "100%";
		}, 300);
		setTimeout(() => {
			document.querySelector(".loaderOverlay").style.display = "none";
			setTimeout(() => {
				document.querySelector(".loaderOverlay").style.left = "-100%";
				document.querySelector(".loaderOverlay").style.display = "flex";
			}, 200);
			
		}, 600);
	}, 300);
	
	//setup the listener for submit button
}

export default Router