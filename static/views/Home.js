import Aview from "/views/abstractView.js";
import animation from "/viewScripts/home/home3dModel.js"
import * as API from "/API/APICall.js"


export default class extends Aview{
    constructor(){
        super();
    }
    getHtml(){
        return `
        <div class="base">
        <div class="firstLine retroShade">
            <div class="text">
                <h1 class="title">${this.language.home.firstTitle}</h1>
                <p>
                    ${this.language.home.firstText}
                </p>
            </div>
            <canvas id="padle">
                
            </canvas>
        </div>
        <div class="secondLine retroShade">
        <canvas id="ground">
            
        </canvas>
        <div class="text">
            <h1 class="title">${this.language.home.secondTitle}</h1>
            <p>
                ${this.language.home.secondText}
            </p>
        </div>
    </div>
    </div>
    `
    }
    setup(){
        if (localStorage.getItem("userWantLink") != null)
        {
            console.log(localStorage.getItem("userWantLink"), "hey")
            API.convertIntraTokenAccount(1).then(res=>{})
            localStorage.removeItem("userWantLink");
        }
        animation();
        this.defineWallpaper("/imgs/backLogin.png", "https://c4.wallpaperflare.com/wallpaper/105/526/545/blur-gaussian-gradient-multicolor-wallpaper-preview.jpg")
	}
}