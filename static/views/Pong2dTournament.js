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

function movementHandler(newState, obj){
    if (newState === "close"){
        document.querySelector(".tournamentManager").style.width = "47svw"
        obj.classList.remove("showCard")
    }
    else if (newState === "open"){
        document.querySelector(".tournamentManager").style.width = "90%"
        obj.classList.add("showCard");
    }
}

export default class extends Aview{
    constructor(){
        super();
        this.pillTexture = pills[0];
        this.groundTexture = grounds[0];
        this.ballTexture = balls[0];
    }

    checkDate(obj){
        let [year, month, day] = obj.tDate.split("-");
        let [hours, minutes] = obj.tTime.split(":");
        //one hour in milliseconds
        let margin = 3600000;
        let inputDate = new Date(year, month - 1, day, hours, minutes).getTime();
        let currDate = new Date().getTime();

        if (inputDate - currDate > margin)
            return (true);
        alert(this.language.tournament.invalidDateTime)
        return (false);
    }

    fieldValidate(val, key){
        let regLength = key == "tDescription" ? 300 : 20;
        console.log(regLength)
        let genericRegex = new RegExp(`^[A-Za-z0-9!?*@$~_ :/-]{5,${regLength}}$`);
        let partecipantsRegex = /^[0-9]+$/;

        console.log(key)
        if (key == "tPartecipants"){
            if (partecipantsRegex.test(val))
                return (Number(val));
            else{
                alert(window.escapeHtml(val) + this.language.tournament.invalidPartecipants)
                return (null);
            }
        }
        if (genericRegex.test(val))
            return (val);
        alert(window.escapeHtml(val) + this.language.tournament.invalidInput)
        return (null);
    }

    populateList(){
        document.querySelector(".tournamentsList").innerHTML = "";
        tournaments.forEach(element => {
            document.querySelector(".tournamentsList").innerHTML += this.getTournamentCard(element);
        });
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
                                ${this.language.tournament.tournamentCard.dateLabel}
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
                        ${obj.registered ? this.language.tournament.tournamentCard.unSubscribe : this.language.tournament.tournamentCard.subScribe}
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
                            <label for="tournamentDescription">${this.language.tournament.newTournament.tDescription}</label>
                            <textarea required maxlength="500" name="tDescription" id="tournamentDescription" type="text"></textarea>
                        </div>
                    </div>
                    <div class="rightSide">
                        <div class="inputLine">
                            <label for="tournamentDate">${this.language.tournament.newTournament.tDate}</label>
                            <div class="dateTimeInput">
                                <input required id="tournamentDate" name="tDate" type="date">
                                <input required id="tournamentHour" name="tTime" type="time">
                            </div>
                        </div>
                        <div class="inputLine">
                            <label for="maxPartecipants">${this.language.tournament.newTournament.tPartecipants}</label>
                            <input required id="maxPartecipants" name="tPartecipants" type="text">
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
            <div class="bodyContainer">

            </div>
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
        document.querySelector(".tournamentsList").addEventListener("click", (e)=>{
            let card = document.querySelector(".displayBodyAndSubbmit");
            if (e.target.classList.contains("subscribe")){
                document.querySelector(".newTournament").classList.remove("showCard")
                if (!e.target.classList.contains("bodyOpened"))
                    movementHandler("open", card);
                else
                    movementHandler("close", card);
                document.querySelector(".displayBodyAndSubbmit .bodyContainer").innerHTML = getCardBody(e.target).innerHTML;
                resetBtnClass(e.target);
                e.target.classList.toggle("bodyOpened");
            }
            if (e.target.classList.contains("unSubscribe")){
                resetBtnClass(e.target);
                movementHandler("close", card);
                setTimeout(() => {
                    if (confirm("Do You really want to unsubscribe this event?")){
                        console.log("event unsubscribed!");
                    }
                }, 300);
            }
        })

        document.querySelector(".showNewTournamentForm").addEventListener("click", ()=>{
            let card = document.querySelector(".newTournament");
            document.querySelector(".displayBodyAndSubbmit").classList.remove("showCard");
            resetBtnClass();
            if (card.classList.contains("showCard")){
                movementHandler("close", card);
            }
            else{
                movementHandler("open", card);
            }
        })
        document.querySelector(".createTournamentBtn").addEventListener("click", (e)=>{
            if (!document.querySelector(".newTournament form").checkValidity()){
                return ;
            }
            e.preventDefault()
            let form = new FormData(document.querySelector(".newTournament form"));
            let obj = {};

            form.forEach((value, key)=>{
                obj[key] = this.fieldValidate(value, key);
                if (obj[key] == null)
                    return;
            })
            if (!this.checkDate(obj)){
                return ;
            }
        });
    }
}