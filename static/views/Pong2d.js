import Aview from "/views/abstractView.js";
import language from "/language/language.js";

export default class extends Aview{
    constructor(){
        super();
    }
    getHtml(){
        return `
        <div class="base">
            <div class="gameContainer">
                <h1 id="display">P1: <span id="p1Score">0</span> | P2: <span id="p2Score">0</span></h1>
                <canvas id="myCanv"></canvas>
                <div class="container">
                    <div class="info">
                        <p>Press space to start</p>
                        <p>LeftPlayer keys: (w:up, s:down)</p>
                        <p>RightPlayer keys: (o:up, l:down)</p>
                    </div>
                    <div class="switch">
                        <button class="single">
                            Single Player
                        </button>
                        <button class="multi">
                            Two Player
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `
    }
	setup(){
        let script = document.createElement("script");
        script.src = "/games/pong2d/pong.js";
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