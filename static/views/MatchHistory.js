import Aview from "/views/abstractView.js";
import Router from "/router/mainRouterFunc.js"
import * as listeners from "/viewScripts/matchHistory/listeners.js"

import * as API from "/API/APICall.js"


export default class extends Aview{
    constructor(){
        super();
    }
    getMatchCard(obj, username){
        let winner = obj.scores[0] > obj.scores[1] ? "left" : "right";
        let date = obj.date.split("-")[0];
        let hour = obj.date.split("-")[1].split(":")[0] + ":" + obj.date.split("-")[1].split(":")[1];
        winner = obj.scores[0] == obj.scores[1] ? "left" : "right";

        if (obj.scores[0] > obj.scores[1])
            winner = "leftWin"
        else if (obj.scores[0] === obj.scores[1])
            winner = "draw"
        else if (obj.scores[0] < obj.scores[1])
            winner = "rightWin"

        if (obj.opponent == null){
            obj.opponent = "User";
            winner = "leftWin";
        }

        return `
            <div class="cardWrap ${obj.tournament_id == undefined ? "normalMatchWrap" : "tournamentCardWrap"}">
            <div class="matchCard ${winner} ${obj.tournament_id == undefined ? "normalMatch" : "tournamentCard"} ">
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
                <div class="matchHistoryBottom">
                    <div class="historyDate">
                        <span>${date}</span><span>  ${hour}</span>
                    </div>
                    ${obj.tournament_id != undefined ? `
                        <span tournamentId="${obj.tournament_id}" class="matchDetails">Get tournament Detais >>></span>
                    ` : ``}
                </div>
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
        let urlParams = new URLSearchParams(window.location.search);
        let username = urlParams.get("username");

        return `
        <div class="base">
            <div class="matchManager">
                ${this.matchInfoAndBodyName()}
                <div class="allTournaments">
                    <div class="matchesTitle">
                        <div class="title">
                            <h3>${username} Match History</h3>
                        </div>
                    </div>
                    <div class="matchesList">
                        <div class="spinner-border matchesSpinner text-success" style="border-radius: 50% !important" role="status">
                        </div>
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
            document.querySelector(".matchesSpinner").style.display = "none"
            document.querySelector(".matchesList").innerHTML = "";
            res.forEach(el=>{
                document.querySelector(".matchesList").innerHTML += this.getMatchCard(el, username);
            })
        })

        document.querySelector(".matchesList").addEventListener("click", listeners.handleTournamentHistory.bind(null, this))

        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpeg")
	}
}