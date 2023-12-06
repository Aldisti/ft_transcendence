import Aview from "/views/abstractView.js";
import language from "/language/language.js";

export default class extends Aview{
    constructor(){
        super();
    }
    getHtml(){
        return `
        <div class="base">
            <div class="playerOne">
                <div class="p1Display"><h1>Score: 0<h1></h1></div>
                <canvas id="botView">
        
                </canvas>
            </div>
            <div class="playerTwo">
                <div class="p2Display"><h1>Score: 0<h1></h1></div>
                <canvas id="topView">
            
                </canvas>
            </div>
        </div>
        `
    }
	setup(){
        let script = document.createElement("script");
        script.src = "/games/pong3d/mainPong3d.js";
        script.type = "module";
        document.body.appendChild(script);
		if (localStorage.getItem("style") == "modern")
		document.querySelector("#app").style.backgroundImage = "url('https://c4.wallpaperflare.com/wallpaper/105/526/545/blur-gaussian-gradient-multicolor-wallpaper-preview.jpg')";
		else
			document.querySelector("#app").style.backgroundImage = "url('/imgs/backLogin.png')";
		document.querySelector("#app").style.backgroundSize = "cover"
		document.querySelector("#app").style.backgroundRepeat = "repeat"
	}
	
}