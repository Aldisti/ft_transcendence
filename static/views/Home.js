import Aview from "/views/abstractView.js";

export default class extends Aview{
    constructor(){
        super();
    }
    getHtml(){
        return `
        <div class="container">
			<h1>Home</h1>
        </div>
        `
    }
}