import Aview from "/views/abstractView.js";
import language from "/language/language.js";
import pongLoader from "/viewScripts/pong2d/loader.js"
import startGame from "/viewScripts/pong2d/startMatch.js"
import handleSlider from "/viewScripts/pong2d/sliders.js"

import * as API from"/API/APICall.js"
import * as URL from"/API/URL.js"

let pills = [ "/imgs/pillsTexture/pill1.png", "/imgs/pillsTexture/pill.png"]
let grounds = [ "/imgs/groundTexture/ground1.jpg", "/imgs/groundTexture/ground2.avif", "/imgs/groundTexture/ground3.jpg"]
let balls = [ "/imgs/ballTexture/tennis.png", "/imgs/ballTexture/basket.png", "/imgs/ballTexture/soccer.png"]
let gameObj = 0


export default class extends Aview{
    constructor(){
        super();
        this.pillTexture = pills[0];
        this.groundTexture = grounds[0];
        this.ballTexture = balls[0];
        this.socket = 0;
        this.game = 0;
    }

    getGameHtml(){
        return `
        <div class="base">
            <div class="left">
                <div id="opponentDisplay">
                    <h4 class="user1"></h4>
                    <h2>0</h2>
                </div>
            </div>
            <div class="center">
                <div class="display">
                    <div id="opponentDisplay">
                        <h4></h4>
                        <h2>0</h2>
                    </div>
                    <div id="currentUserDisplay">
                        <h4></h4>
                        <h2>0</h2>
                    </div>
                </div>
                <div class="gameContainerPadding">
                    <div class="gameContainer">
                        <div class="gameOverlay">
                            <div class="gameLoader spinner-border" role="status">
                            </div>
                        </div>
                        <div class="gameOverlayWin">
                            <h2>You have Win</h2>
                        </div>
                        <div class="gameOverlayLoose">
                            <h2>You have Lost</h2>
                        </div>
                        <canvas id="myCanv"></canvas>
                    </div>
                </div>
                <div clsss="gameInfoBox">
                </div>
                <div class="mobileControl">
                    <div class="mobile up">⬆</div>
                    <div class="mobile down">⬇</div>
                </div>
            </div>
            <div class="right">
                <div id="currentUserDisplay">
                    <h4 class="user2"></h4>
                    <h2>0</h2>
                </div>
            </div>
        </div>
        `
    }
    getHtml(){
        return `
        <div class="base">
            <div class="themeContainer">
                <div class="pillsTheme">
                    <div class="themeDisplay">
                        <div class="sliderPill">
                        </div>
                    </div>
                    <div class="info">
                    <h3>Choose Pill Style</h3>
                    <div class="nextPill">
                        >
                    </div>
                    </div>
                </div>
                <div class="groundTheme">
                    <div class="themeDisplay">
                        <div class="sliderGround">
                        </div>
                    </div>
                    <div class="info">
                    <h3>Choose Ground Style</h3>
                        <div class="nextGround">
                            >
                        </div>
                    </div>
                </div>
                <div class="ballTheme">
                    <div class="themeDisplay">
                        <div class="sliderBall">
                        </div>
                    </div>
                    <div class="info">
                    <h3>Choose Ball Style</h3>
                    <div class="nextBall">
                        >
                    </div>
                    </div>
                </div>
            </div>
            <div class="btnContainer">
                <div class="btnWindow">
                    <h1>Pong Queue</h1>
                    <canvas id="waitCanv" style="display: none;"></canvas>
                    <button id="startQueque">
                        Enter !
                    </button>
                </div>
            </div>
        </div>
        `
    }

	setup(){
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpeg")
        document.querySelector("#waitCanv").style.width = "80%"
        document.querySelector("#waitCanv").style.height = "50%"
        localStorage.setItem("gameStarted", "false");

        handleSlider(".sliderPill", ".nextPill", pills, "pillTexture", this);
        handleSlider(".sliderGround", ".nextGround", grounds, "groundTexture", this);
        handleSlider(".sliderBall", ".nextBall", balls, "ballTexture", this);

        pongLoader();

        document.querySelector("#startQueque").addEventListener("click", async ()=>{
            
            document.querySelector(".btnWindow").style.height = "70%";
            document.querySelector("#waitCanv").style.display= "flex";
            document.querySelector("#startQueque").innerHTML = `<span>Searching opponent...</span><div class="spinner-border text-warning" style="border-radius: 50% !important"></div>` 

            API.startQueque(1).then(res=>{
                this.socket = new WebSocket(`${URL.socket.QUEUE_SOCKET}?ticket=${res.ticket}&username=${localStorage.getItem("username")}`);
                this.socket.addEventListener("message", (message)=>{
                    let msg = JSON.parse(message.data);
                    console.log(msg)
                    localStorage.setItem("gameStarted", "true");
                    document.querySelector("#app").innerHTML = this.getGameHtml();
                    gameObj = startGame(this.ballTexture, this.groundTexture, this.pillTexture, msg);
                })
            })
        })

    }

    destroy(){
        // this.socket.close();
        if (gameObj != 0)
            gameObj.socket.close(3002);
    }
	
}