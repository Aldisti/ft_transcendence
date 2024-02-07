import Aview from "/views/abstractView.js";
import language from "/language/language.js";
import handleSlider from "/viewScripts/pong2d/sliders.js"

import * as API from"/API/APICall.js"
import * as URL from"/API/URL.js"

let pills = [ "/imgs/pillsTexture/pill1.png", "/imgs/pillsTexture/pill.png"]
let grounds = [ "/imgs/groundTexture/ground1.jpg", "/imgs/groundTexture/ground2.avif", "/imgs/groundTexture/ground3.jpg"]
let balls = [ "/imgs/ballTexture/tennis.png", "/imgs/ballTexture/basket.png", "/imgs/ballTexture/soccer.png"]

let tournaments = [{title: "First Tournament", description: "Eccoci pronti per il torneo di Pong, il gioco che ha dato il via alla storia dei videogiochi! Unisciti a noi per un'epica sfida all'ultimo pixel.", date: "07/07/2024.17:42", partecipants: "0", total: "100", registered: false}, {title: "First Tournament", description: "Affina i tuoi riflessi, pianifica le tue mosse e preparati a colpire con precisione millimetrica. Sfida i tuoi amici o dimostra la tua superiorità contro avversari nuovi di zecca.", date: "07/07/2024.17:42", partecipants: "90", total: "100", registered: false}, {title: "First Tournament", description: "lorem ipsudjvkja sv sf vs fv vsf b sf bsb sg nd gb", date: "07/07/2024.17:42", partecipants: "10", total: "100", registered: true}, {title: "First Tournament", description: "lorem ipsudjvkja sv sf vs fv vsf b sf bsb sg nd gb", date: "07/07/2024.17:42", partecipants: "60", total: "100", registered: false}];

function getCardBody(el){

    while(!el.classList.contains("tournamentCard")){
        el = el.parentNode;
    }
    return el.querySelector(".hiddenBody");
}

function resetBtnClass(currentEl){
    document.querySelectorAll(".subscribe").forEach(el=>{
        if (currentEl === undefined || el !== currentEl)
            el.classList.remove("bodyOpened")
    })
}

export default class extends Aview{
    constructor(){
        super();
        this.pillTexture = pills[0];
        this.groundTexture = grounds[0];
        this.ballTexture = balls[0];
    }

    getTournamentCard(obj){
        let percentage = obj.partecipants / obj.total;
        let color = "white"
        if (percentage < 0.4)
            color = "var(--bs-success)";
        if (percentage >= 0.4 && percentage <= 0.7)
            color = "var(--bs-warning)";
        if (percentage > 0.7)
            color = "var(--bs-danger)";

        return `
            <div class="tournamentCard">
                <div class="tournamentCardTitle">
                    <h5>${obj.title}</h5>
                
                    <div class="partecipants" style="background-color: ${color};">
                        <span class="actualPartecipants">
                            ${obj.partecipants != undefined ? obj.partecipants : "0"}
                        </span>
                        <span>
                            /
                        </span>
                        <span class="totalPartecipants">
                            ${obj.total != undefined ? obj.total : "0"}
                        </span>
                    </div>
                </div>
                <div class="hiddenBody">
                    ${obj.description}
                </div>
                <div class="bottomLine">
                    <div class="eventDate">
                        <div class="label">
                            <span class="dateLabel">
                                Starting Date:
                            </span>
                        </div>
                        <div class="dateAndTime">
                            <span class="date">
                                ${obj.date.split(".")[0]}
                            </span>
                            <span class="time">
                                ${obj.date.split(".")[1]}
                            </span>
                        </div>
                    </div>
                    <button class="subscribeBtn ${obj.registered ? `unSubscribe` : `subscribe`}" style="background-color: ${obj.registered ? `var(--bs-danger)` : `var(--bs-success)`}">
                        ${obj.registered ? `Unsubscribe` : `Take Part`}
                    </button>
                </div>
            </div>
        `
    }

    newTournamentForm(){
        return `
        <div class="newTournament">
            <h2>Create Tournament</h2>
            <form>
                <div class="inputContainer">
                    <div class="leftSide">
                        <div class="inputLine">
                            <label for="tournamentName">Tournament Name:</label>
                            <input id="tournamentName" type="text">
                        </div>
                        <div class="inputLine">
                            <label for="tournamentDescription">Tournament Description:</label>
                            <textarea id="tournamentDescription" type="text"></textarea>
                        </div>
                    </div>
                    <div class="rightSide">
                        <div class="inputLine">
                            <label for="tournamentDate">Tournament Date:</label>
                            <div class="dateTimeInput">
                                <input id="tournamentDate" type="date">
                                <input id="tournamentHour" type="time">
                            </div>
                        </div>
                        <div class="inputLine">
                            <label for="maxPartecipants">Max Partecipants:</label>
                            <input id="maxPartecipants" type="text">
                        </div>
                    </div>
                </div>
                <button>Create!</button>
            </form>
        </div>
        `
    }

    getGameHtml(){
        return `
        <div class="base">
            <div class="left">
                <div id="opponentDisplay">
                    <h4 class="user1"></h4>
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
                <div class="gameContainerPadding">
                    <div class="gameContainer">
                        <canvas id="myCanv"></canvas>
                    </div>
                </div>
                <div class="mobileControl">
                    <div class="mobile up">⬆</div>
                    <div class="mobile down">⬇</div>
                </div>
            </div>
            <div class="right">
                <div id="currentUserDisplay">
                    <h4 class="user2"></h4>
                    <h2>48</h2>
                </div>
            </div>
        </div>
        `
    }

    tournamentInfoAndBodyName(){
        return `
        <div class="displayBodyAndSubbmit">
            <div class="bodyContainer">

            </div>
            <div class="displayNameAndSubmit">
                <h3>Display Name</h3>
                <input >
                <button>Submit</button>
            </div>
        </div>
        `
    }
    getHtml(){
        return `
        <div class="base">
            <div class="tournamentManager">
                ${this.tournamentInfoAndBodyName()}
                ${this.newTournamentForm()}
                <div class="allTournaments">
                    <div class="tournamentsTitle">
                        <div class="titleLeft">
                            <h3>Tournaments List</h3>
                            <input>
                        </div>
                        <div class="titleRight">
                            <div class="tournamentSearchBar">
                                <button class="importantSubmit search">search</button><button class="restoreBtn">X</button>
                            </div>
                            <button class="createTournamentBtn">+</button>
                        </div>
                    </div>
                    <div class="tournamentsList">
                    </div>
                </div>
            </div>
        </div>
        `
    }

	setup(){
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpeg")
        // localStorage.setItem("gameStarted", "false");
        // handleSlider(".sliderPill", ".nextPill", pills, "pillTexture", this);
        // handleSlider(".sliderGround", ".nextGround", grounds, "groundTexture", this);
        // handleSlider(".sliderBall", ".nextBall", balls, "ballTexture", this);
        tournaments.forEach(element => {
            document.querySelector(".tournamentsList").innerHTML += this.getTournamentCard(element);
        });
        document.querySelector(".tournamentsList").addEventListener("click", (e)=>{
            if (e.target.classList.contains("subscribe")){
                document.querySelector(".newTournament").classList.remove("showCard")
                if (!e.target.classList.contains("bodyOpened")){
                    document.querySelector(".tournamentManager").style.width = "90%"
                    document.querySelector(".tournamentManager").style.justifyContent = "flex-start"
                    document.querySelector(".displayBodyAndSubbmit").classList.add("showCard");
                }
                else{
                    document.querySelector(".tournamentManager").style.width = "47svw"
                    document.querySelector(".displayBodyAndSubbmit").classList.remove("showCard");
                }
                document.querySelector(".displayBodyAndSubbmit .bodyContainer").innerHTML = getCardBody(e.target).innerHTML;
                resetBtnClass(e.target);

                e.target.classList.toggle("bodyOpened");
            }
            if (e.target.classList.contains("unSubscribe")){
                console.log("unsub")
            }
        })

        document.querySelector(".createTournamentBtn").addEventListener("click", ()=>{
            document.querySelector(".displayBodyAndSubbmit").classList.remove("showCard");
            resetBtnClass();
            if (document.querySelector(".newTournament").classList.contains("showCard")){
                document.querySelector(".tournamentManager").style.width = "47svw"
                document.querySelector(".newTournament").classList.remove("showCard")
            }
            else{
                document.querySelector(".tournamentManager").style.width = "90%"
                document.querySelector(".tournamentManager").style.justifyContent = "flex-start"
                document.querySelector(".newTournament").classList.add("showCard");
            }
        })
    }
}