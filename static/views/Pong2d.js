import Aview from "/views/abstractView.js";
import pongLoader from "/viewScripts/pong2d/loader.js"
import startGame from "/viewScripts/pong2d/startMatch.js"
import handleSlider from "/viewScripts/pong2d/sliders.js"
import * as API from"/API/APICall.js"
import * as URL from"/API/URL.js"

let pills = [ "/imgs/pillsTexture/pill1.png", "/imgs/pillsTexture/pill.png"]
let grounds = [ "/imgs/groundTexture/ground1.jpg", "/imgs/groundTexture/ground2.avif", "/imgs/groundTexture/ground3.jpg"]
let balls = [ "/imgs/ballTexture/tennis.png", "/imgs/ballTexture/basket.png", "/imgs/ballTexture/soccer.png"]
let gameObj = 0;
let socket = 0;

export default class extends Aview{
    constructor(){
        super();
        this.pillTexture = pills[0];
        this.groundTexture = grounds[0];
        this.ballTexture = balls[0];
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
                <div id="currentUserDisplay">
                    <h4 class="user2"></h4>
                    <h2>0</h2>
                </div>
                <div id="gameAdvice">
                    <ul>
                        <li>W: Go Up</li>
                        <li>D: Go down</li>
                        <li>P: Start The Game!</li>
                        <li>If you leave the window or refresh the page you will automatically loose!</li>
                    </ul>
                    <h5 class="gameStart">
                        You need to press P to start the game
                    </h5>
                    <h5 class="gameWait">
                        Waiting other player starting the game
                    </h5>
                </div>
            </div>
            <div class="center">
                <div class="display">
                    <div id="opponentDisplayMobile">
                        <h4></h4>
                        <h2>0</h2>
                    </div>
                    <div id="currentUserDisplayMobile">
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
                            <a href="/games/pong2d/" data-link>Play Again!</a>
                        </div>
                        <div class="gameOverlayLoose">
                            <h2>You have Lost</h2>
                            <a href="/games/pong2d/" data-link>Play Again!</a>
                        </div>
                        <canvas id="myCanv"></canvas>
                    </div>
                </div>
                <div clsss="gameInfoBox">
                </div>
                <div class="mobileControl">
                    <div class="mobile up">⬆</div>
                    <div class="mobile start">Start</div>
                    <div class="mobile down">⬇</div>
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
                <div class="acceptGame">
                    <h3>Press to Start The Game</h3>
                    <button>Start</button>
                </div>
                <div class="btnWindow">
                    <h1>Pong Queue</h1>
                    <canvas id="waitCanv" style="display: none;"></canvas>
                    <div id="startQueque">
                        Enter !
                    </div>
                </div>
            </div>
        </div>
        `
    }

    startQueueBtn(){
        document.querySelector("#startQueque").innerHTML = `
        <div>
            Searching opponent...
        </div>

        <button class="stopSearching">X</button> 
        ` 
        API.startQueque(1).then(res=>{
            if (res == undefined)
                return ;
            socket = new WebSocket(`${URL.socket.QUEUE_SOCKET}?ticket=${res.ticket}&username=${localStorage.getItem("username")}`);
            socket.onopen = ()=>{
                socket.addEventListener("message", (message)=>{
                    let msg = JSON.parse(message.data);
                    localStorage.setItem("gameStarted", "true");
                    document.querySelector("#app").innerHTML = this.getGameHtml();
                    gameObj = startGame(this.ballTexture, this.groundTexture, this.pillTexture, msg);
                    socket.close();
                    socket = 0;
                })
            } 
        })
    }

    defineQueue(){
        const url = window.location.href;

        if (url.indexOf("match") == -1){
            let startGame = document.querySelector(".acceptGame");

            startGame.style.display = "none";
            document.querySelector("#startQueque").addEventListener("click", async ()=>{
                document.querySelector(".btnWindow").style.height = "50%";
                document.querySelector("#waitCanv").style.display= "flex";
                document.querySelector("#startQueque").style.justifyContent = "space-between";
    
                if (document.querySelector("#startQueque").innerHTML.trim() != `Enter !`)
                    this.restoreQueueBtn()
                else
                    this.startQueueBtn()
            })
        }
        else{
            let startQueque = document.querySelector(".btnWindow");

            startQueque.style.display = "none";
            document.querySelector(".acceptGame button").addEventListener("click", ()=>{
                API.getTournamentTicket(1).then(res=>{

                })
            })
        }
    }

    restoreQueueBtn(){
        document.querySelector("#waitCanv").style.display= "none";
        document.querySelector(".btnWindow").style.height = "30%";
        document.querySelector("#startQueque").style.justifyContent = "center";
        document.querySelector("#startQueque").innerHTML = `Enter !`
        socket.close();
    }

	setup(){
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpeg")
        let params = new URLSearchParams(window.location.search)

        if (params.size != 0){
            document.querySelector("#app").innerHTML = this.getGameHtml();
            let conf = {
                user1: localStorage.getItem("username"),
                userDisplay: params.get("userDisplay"),
                user2: params.get("opponent"),
                opponentDisplay: params.get("opponentDisplay"),
                tournamentId: params.get("tournamentId"),
                ticket: params.get("token")
            }
            gameObj = startGame(this.ballTexture, this.groundTexture, this.pillTexture, conf);
            return ;
        }

        document.querySelector("#waitCanv").style.width = "100%"
        document.querySelector("#waitCanv").style.height = "50%"
        localStorage.setItem("gameStarted", "false");

        handleSlider(".sliderPill", ".nextPill", pills, "pillTexture", this);
        handleSlider(".sliderGround", ".nextGround", grounds, "groundTexture", this);
        handleSlider(".sliderBall", ".nextBall", balls, "ballTexture", this);

        pongLoader();
        this.defineQueue();
    }

    destroy(){
        if (socket != 0){
            socket.close();
        }
        if (gameObj != 0)
            gameObj.socket.close(3002);
        document.removeEventListener("keyup", gameObj.upHandler)
        document.removeEventListener("keydown", gameObj.downHandler)
        localStorage.setItem("stop", "true")
    }
	
}