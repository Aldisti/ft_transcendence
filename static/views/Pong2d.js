import Aview from "/views/abstractView.js";
import language from "/language/language.js";
import startGame from "/games/pong2d/mainLoop.js"
import Ball from "/games/pong2d/Ball.js"
import Paddle from "/games/pong2d/Paddle.js"

import * as API from"/API/APICall.js"

let gameStarted = false;

export default class extends Aview{
    constructor(){
        super();
    }

    getGameHtml(){
        return `
        <div class="base">
            <div class="left">
            </div>
            <div class="center">
                <div id="usersDisplay">
                    <div id="opponentDisplay">
                        <h4>gpanico</h4>
                        <h2>28</h2>
                    </div>
                    <div id="currentUserDisplay">
                        <h4>mpaterno</h4>
                        <h2>48</h2>
                    </div>
                </div>
                <canvas id="myCanv"></canvas>
            </div>
            <div class="right">
            </div>
        </div>
        `
    }
    getHtml(){
        return `
        <div class="base">
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
    startGame(){
        let gameCanvas = 800;

        document.querySelector(".center").style.width = `${gameCanvas}px`;
        startGame({ 
            previousTime: window.performance.now(),
            canvas: document.querySelector("#myCanv"),
            width: gameCanvas,
            height: (gameCanvas / 1.77),
            frameInterval: 1000 / 60,
            ratio: 1.77,
            texture: "https://img.freepik.com/free-vector/vector-green-soccer-field-football-field-gridiron_1284-41290.jpg",
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
	setup(){
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpg")
        document.querySelector("#waitCanv").style.width = "50%"
        document.querySelector("#waitCanv").style.height = "30%"

        let previousTime = window.performance.now();
        let frameInterval = 1000 / 60;
        let ball = new Ball(document.querySelector("#waitCanv"), {size:12});
        let left = new Paddle(document.querySelector("#waitCanv"), {
            width: 5,
            height: 70,
            x: 0,
            y: 0,
        });
        let right = new Paddle(document.querySelector("#waitCanv"), {
            width: 5,
            height: 70,
            x: 0,
            y: 0,
        });
            
        function animate()
        {
            if (gameStarted || document.querySelector("#waitCanv") == null)
                return ;
            requestAnimationFrame(animate);
        	const now = window.performance.now();
        	const deltaTime = now - previousTime;
        	if (deltaTime < frameInterval) {
        		return;
        	}
        	previousTime = now;
            gameStarted
        	ball.calculatePosition();
            right.y = ball.y - 35
            right.x = document.querySelector("#waitCanv").width - 5;
            left.y = ball.y - 35
            ball.ctx.fillStyle = "white";
            ball.ctx.fillRect(0, 0, document.querySelector("#waitCanv").width, document.querySelector("#waitCanv").height);
            ball.draw();
            left.draw();
            right.draw();
        }

        animate();
        document.querySelector("#startQueque").addEventListener("click", async ()=>{
            document.querySelector(".btnWindow").style.height = "40%";
            document.querySelector("#waitCanv").style.display= "flex";

            document.querySelector("#startQueque").innerHTML = `<span>Searching opponent...</span><div class="spinner-border text-warning" style="border-radius: 50% !important"></div>`

            API.startQueque(1).then(res=>{
                gameStarted = true;
                let socket = new WebSocket(`ws://localhost:7000/ws/matchmaking/queue/?ticket=${res.ticket}&username=${localStorage.getItem("username")}`);
                document.querySelector("#app").innerHTML = this.getGameHtml();
                this.startGame();
                socket.addEventListener("message", (message)=>{
                    console.log(message.data)
                })
            })
        })
    }
	
}