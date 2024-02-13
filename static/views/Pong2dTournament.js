import Aview from "/views/abstractView.js";
import * as listeners from "/viewScripts/pong2dTournament/listeners.js"
import * as API from"/API/APICall.js"


export default class extends Aview{
    constructor(){
        super();
    }

    populateList(){
        document.querySelector(".tournamentsList").innerHTML = "";
        API.getTournamentsList(1).then(tournaments=>{
            tournaments.results.forEach(element => {
                document.querySelector(".tournamentsList").innerHTML += this.getTournamentCard(element);
            });
        })
    }



    getTournamentCard(obj){
        let percentage = obj.subscribed / obj.participants;
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
                            ${obj.subscribed != undefined ? obj.subscribed : "0"}
                        </span>
                        <span>
                            /
                        </span>
                        <span class="totalPartecipants">
                            ${obj.participants != undefined ? obj.participants : "0"}
                        </span>
                    </div>
                </div>

                <div class="bottomLine">
                    <div class="tournamentBody">
                        ${obj.description}
                    </div>
                    <button class="subscribeBtn ${obj.registered.includes(localStorage.getItem("username")) ? `unSubscribe` : `subscribe`}" style="background-color: ${obj.registered.includes(localStorage.getItem("username")) ? `var(--bs-danger)` : `var(--bs-success)`}">
                        ${obj.registered.includes(localStorage.getItem("username")) ? this.language.tournament.tournamentCard.unSubscribe : this.language.tournament.tournamentCard.subScribe}
                    </button>
                </div>
            </div>
        `
    }

    newTournamentForm(){
        return `
        <div class="newTournament">
            <h2>${this.language.tournament.newTournament.tTitle}</h2>
            <form>
                <div class="inputContainer">
                    <div class="leftSide">
                        <div class="inputLine">
                            <label for="tournamentName">${this.language.tournament.newTournament.tName}</label>
                            <input required id="tournamentName" name="tName" type="text">
                        </div>
                        <div class="inputLine">
                            <label for="maxPartecipants">${this.language.tournament.newTournament.tPartecipants}</label>
                            <input required id="maxPartecipants" name="tPartecipants" type="text">
                        </div>
                        <div class="inputLine">
                            <label for="tournamentDescription">${this.language.tournament.newTournament.tDescription}</label>
                            <textarea required maxlength="500" name="tDescription" id="tournamentDescription" type="text"></textarea>
                        </div>
                    </div>
                </div>
                <button class="createTournamentBtn">${this.language.tournament.newTournament.tCreate}</button>
            </form>
        </div>
        `
    }

    tournamentInfoAndBodyName(){
        return `
        <div class="displayBodyAndSubbmit">
            <div class="displayNameAndSubmit">
                <h3>${this.language.tournament.displayName}</h3>
                <input >
                <button>${this.language.tournament.submitBtn}</button>
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
                            <h3>${this.language.tournament.title}</h3>
                            <input>
                        </div>
                        <div class="titleRight">
                            <div class="tournamentSearchBar">
                                <button class="importantSubmit search">${this.language.tournament.searchBtn}</button><button class="restoreBtn">X</button>
                            </div>
                            <button class="showNewTournamentForm">+</button>
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
        this.populateList()

        //if the button pressed is subscribe show the displayName form otherwise make the apicall to unsubscribe the selceted event
        document.querySelector(".tournamentsList").addEventListener("click", listeners.handleTournamentSubscription.bind(null, this))

        //show the form when the + button is clicked
        document.querySelector(".showNewTournamentForm").addEventListener("click", listeners.exposeNewTournamentForm)
        
        //submit the form to create new tournament
        document.querySelector(".createTournamentBtn").addEventListener("click", listeners.handleTournamentCreation.bind(null, this));

        //handle the subscription to the selected tournament
        document.querySelector(".displayNameAndSubmit button").addEventListener("click", listeners.handleTournamentSubscribe.bind(null, this))

        document.querySelector(".restoreBtn").addEventListener("click", ()=>{
            this.populateList();
        })

        
    }
}