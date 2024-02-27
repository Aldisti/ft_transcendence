import Aview from "/views/abstractView.js";

export default class extends Aview{
    constructor(){
        super();
    }
    getHtml(){
        return `
		<div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
			<span class="sr-only">Loading...</span>
	  	</div>
        `
    }
}