import Aview from "/views/abstractView.js";
import language from "/language/language.js";
import pongLoader from "/viewScripts/pong2d/loader.js"
import startGame from "/viewScripts/pong2d/startMatch.js"

import * as API from"/API/APICall.js"
import * as URL from"/API/URL.js"


export default class extends Aview{
    constructor(){
        super();
    }

    getGameHtml(){
        return `
        <div class="base">
            <div class="left">
                <div id="opponentDisplay">
                    <h4>gpanico</h4>
                    <h2>28</h2>
                </div>
            </div>
            <div class="center">
                <div class="display">
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
                <div class="mobileControl">
                    <div class="mobile up">⬆</div>
                    <div class="mobile down">⬇</div>
                </div>
            </div>
            <div class="right">
                <div id="currentUserDisplay">
                    <h4>mpaterno</h4>
                    <h2>48</h2>
                </div>
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

	setup(){
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpg")
        document.querySelector("#waitCanv").style.width = "50%"
        document.querySelector("#waitCanv").style.height = "30%"
        localStorage.setItem("gameStarted", "false");

        pongLoader();
        document.querySelector("#startQueque").addEventListener("click", async ()=>{
            document.querySelector(".btnWindow").style.height = "40%";
            document.querySelector("#waitCanv").style.display= "flex";
            document.querySelector("#startQueque").innerHTML = `<span>Searching opponent...</span><div class="spinner-border text-warning" style="border-radius: 50% !important"></div>` 
            API.startQueque(1).then(res=>{
                localStorage.setItem("gameStarted", "true");
                let socket = new WebSocket(`${URL.socket.QUEUE_SOCKET}?ticket=${res.ticket}&username=${localStorage.getItem("username")}`);
                socket.addEventListener("message", (message)=>{
                    console.log(message.data)
                })
                document.querySelector("#app").innerHTML = this.getGameHtml();
                startGame();
            })
        })
    }
	
}