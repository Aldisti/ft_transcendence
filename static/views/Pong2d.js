import Aview from "/views/abstractView.js";
import language from "/language/language.js";
import startGame from "/games/pong2d/mainLoop.js"
import * as API from"/API/APICall.js"


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
            <button id="startQueque">
                ciaoooo
            </button>
        </div>
        `
    }
	setup(){
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpg")
        document.querySelector("#startQueque").addEventListener("click", async ()=>{
            API.startQueque(1).then(res=>{
                let socket = new WebSocket(`ws://localhost:7000/ws/matchmaking/queue/?ticket=${res.ticket}&username=${localStorage.getItem("username")}`);
                socket.addEventListener("mesaage", (message)=>{
                    console.log(message.data)
                })
            })
        })
        // let gameCanvas = 1100;
        // document.querySelector(".center").style.width = `${gameCanvas}px`;
        // startGame({ 
        //     previousTime: window.performance.now(),
        //     canvas: document.querySelector("#myCanv"),
        //     width: gameCanvas,
        //     height: (gameCanvas / 1.77),
        //     frameInterval: 1000 / 60,
        //     ratio: 1.77,
        //     texture: "https://img.freepik.com/free-vector/vector-green-soccer-field-football-field-gridiron_1284-41290.jpg",
        //     currentUser: "paddleRight",
        //     ballConfig: {
        //         // texture: "/imgs/ball.png", 
        //         size: 20
        //     },
        //     padleRightConfig: {
        //         width: 20,
        //         height: 100,
        //         texture: "/imgs/pill.png",
        //         x: 0,
        //         y: 0,
        //     },
        //     padleLeftConfig: {
        //         width: 20,
        //         height: 100,
        //         texture: "/imgs/pill.png",
        //         x: 0,
        //         y: 0,
        //     }
        // });
    }
	
}