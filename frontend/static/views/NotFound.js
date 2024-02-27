import Aview from "/views/abstractView.js";
import * as API from "/API/APICall.js"


export default class extends Aview{
    constructor(){
        super();
    }
    getHtml(){
        return `
        <div class="base">
            <div class="container">
                <div class="errorTextContainer">
                    <h1>${this.language.errorPage.firstLine}</h1>
                    <h2>${this.language.errorPage.secondLine}</h2>
                </div>
                <div class="imgWrap">
                    <img src="${localStorage.getItem("style") == "modern" ? `/imgs/notFound.jpg` : `/imgs/pixelatedError.jpg`}">
                </div>
            </div>
        </div>
    `
    }
    setup(){
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpeg")
	}
}