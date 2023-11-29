import Routes from "/scripts/initRoutes.js"

const Router =()=>{
	let matechedLocation = 0;
	
	for (let route of Routes)
	{
		//if found set lastClass to delete previus css and set matchedLocation to update the new html
		if (route.path == location.pathname)
		{
			matechedLocation = new route.view;
			break ;
		}
	}
	//if no path match the '/' is setted
	if (matechedLocation == 0)
		matechedLocation = new Routes[0].view;
	document.querySelector("#app").innerHTML = matechedLocation.getHtml();
	
	//setup the listener for submit button
	if (matechedLocation.needListener)
	{
		document.querySelector("#" + matechedLocation.listenerId).addEventListener("click", ()=>{
			console.log(matechedLocation.getInput());
		})
	}
}

export default Router