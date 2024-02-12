import Aview from "/views/abstractView.js";
import Router from "/router/mainRouterFunc.js"
import * as listeners from "/viewScripts/matchHistory/listeners.js"

import * as API from "/API/APICall.js"


export default class extends Aview{
    constructor(){
        super();
    }
    getMatchCard(obj){
        let username = localStorage.getItem("username");

        return `
            <div class="cardWrap ${obj.id == undefined ? "normalMatchWrap" : "tournamentCardWrap"}">
            <div class="matchCard ${obj.scores[0] > obj.scores[1] ? "rightWin" : "leftWin"} ${obj.id == undefined ? "normalMatch" : "tournamentCard"}">
                <div class="topLine">
                    <h3>${username}</h3>
                    <span>VS</span>
                    <h3>${obj.opponent}</h3>
                </div>
                <div class="botLine">
                    <div class="scores">
                        <h1>${obj.scores[0]}</h1>
                    </div>       
                    <div class="scores">
                        <h1>${obj.scores[1]}</h1>
                    </div>     
                </div>
            </div>
                ${obj.id != undefined ? `
                    <div class="tournamentInfo">
                        <span class="matchDetails">Get tournament Detais >>></span>
                    </div>
                ` : ``}
            </div>
        `
    }
    matchInfoAndBodyName(){
        return `
        <div class="matchInfoContainer">
            <div class="drawMatch" style="width: 100%; height: 100%; display: flex; flex-direction: column-reverse;">
            
            </div>
        </div>
        `
    }
    getHtml(){
        return `
        <div class="base">
            <div class="matchManager">
                ${this.matchInfoAndBodyName()}
                <div class="allTournaments">
                    <div class="matchesTitle">
                        <div class="titleLeft">
                            <h3>test</h3>
                            <input>
                        </div>
                        <div class="titleRight">
                            <div class="matchSearchBar">
                                <button class="importantSubmit search">test</button><button class="restoreBtn">X</button>
                            </div>
                        </div>
                    </div>
                    <div class="matchesList">
                    </div>
                </div>
            </div>
        </div>
        `
    }
    setup(){
        let urlParams = new URLSearchParams(window.location.search);
        let username = urlParams.get("username");

        if (username == undefined){
            history.pushState(null, null, "/");
            Router();
        }

        API.getMatchHistory(1, username).then(res=>{
            document.querySelector(".matchesList").innerHTML = "";
            res.forEach(el=>{
                document.querySelector(".matchesList").innerHTML += this.getMatchCard(el);
            })
        })

        document.querySelector(".matchesList").addEventListener("click", listeners.handleTournamentHistory.bind(null, this))

        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpeg")
	}
}