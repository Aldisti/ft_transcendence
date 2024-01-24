import Aview from "/views/abstractView.js";
import language from "/language/language.js";
import startGame from "/games/pong2d/mainLoop.js"


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
                </div>
            </div>
        </div>
        `
    }
	setup(){
        this.defineWallpaper("/imgs/backLogin.png", "https://c4.wallpaperflare.com/wallpaper/105/526/545/blur-gaussian-gradient-multicolor-wallpaper-preview.jpg")
        startGame({ 
            previousTime: window.performance.now(),
            canvas: document.querySelector("#myCanv"),
            width: 800,
            height: 451,
            frameInterval: 1000 / 60,
            ratio: 1.77,
            currentUser: "paddleRight",
            ballConfig: {
                texture: "/imgs/ball.png", 
                size: 20
            },
            padleRightConfig: {
                width: 20,
                height: 100,
                texture: "/imgs/pill.png",
                x: 0,
                y: 0,
            },
            padleLeftConfig: {
                width: 20,
                height: 100,
                texture: "/imgs/pill.png",
                x: 0,
                y: 0,
            }
        });
    }
	
}