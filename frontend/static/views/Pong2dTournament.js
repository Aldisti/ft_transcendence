import Aview from "/views/abstractView.js";
import * as listeners from "/viewScripts/pong2dTournament/listeners.js"
import * as API from"/API/APICall.js"

export default class extends Aview{page
    constructor(){
        super();
        this.page = 1;
        this.size = 5;
        this.options = {title: "", participants: ""}
        this.endTournament = false;
        this.flag = false;
        
    }

    getTournamentCard(obj){
        let percentage = obj.subscribed / obj.participants;

        let color = "white"
        if (percentage < 0.6)
            color = "var(--bs-success)";
        if (percentage >= 0.6 && percentage < 1)
            color = "var(--bs-warning)";
        if (percentage == 1)
            color = "var(--bs-danger)";

        return `
            <div class="cardWrap">
                <div class="startDateContainer">
                    <div class="spanLine">
                        <h4>Date</h4>
                        <span>${obj.start_date.split("T")[0]}</span>
                    </div>
                    <div class="spanLine">
                        <h4>Time</h4>
                        <span>${obj.start_date.split("T")[1]}</span>
                    </div>
                </div>
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
                        ${percentage < 1 ? `
                            <button tournamentId="${obj.id}" class="subscribeBtn ${obj.registered.includes(localStorage.getItem("username")) ? `unSubscribe` : `subscribe`}" style="background-color: ${obj.registered.includes(localStorage.getItem("username")) ? `var(--bs-danger)` : `var(--bs-success)`}">
                                ${obj.registered.includes(localStorage.getItem("username")) ? this.language.tournament.tournamentCard.unSubscribe : this.language.tournament.tournamentCard.subScribe}
                            </button>
                        ` : ``}
                    </div>
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
                            <input placeholder="${this.language.tournament.normalLimit}" required id="tournamentName" name="tName" type="text">
                        </div>
                        <div class="inputLine">
                            <label for="maxPartecipants">${this.language.tournament.newTournament.tPartecipants}</label>
                            <input value="4" required id="maxPartecipants" name="tPartecipants" type="number">
                        </div>
                        <div class="inputLine">
                            <label for="maxPartecipants">${this.language.tournament.newTournament.tDisplayName}</label>
                            <input placeholder="${this.language.tournament.normalLimit}" required id="displayName" name="tDisplayName" type="text">
                        </div>
                        <div class="specialLine">
                            <div class="halfInputLine">
                                <label for="maxPartecipants">${this.language.tournament.newTournament.tDate}</label>
                                <input placeholder="${this.language.tournament.normalLimit}" required id="date" name="tDate" type="date">
                            </div>
                            <div class="halfInputLine">
                                <label for="maxPartecipants">${this.language.tournament.newTournament.tTime}</label>
                                <input placeholder="${this.language.tournament.normalLimit}" required id="time" name="tTime" type="time">
                            </div>
                        </div>
                        <div class="inputLine">
                            <label for="tournamentDescription">${this.language.tournament.newTournament.tDescription}</label>
                            <textarea placeholder="${this.language.tournament.bigLimit}" required maxlength="500" name="tDescription" id="tournamentDescription" type="text"></textarea>
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
                <button class="submitter">${this.language.tournament.submitBtn}</button>
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
                            <div class="inputAndSelect">
                                <input>
                                <select>
                                    <option>all</option>
                                    <option>4</option>
                                    <option>8</option>
                                    <option>16</option>
                                </select>
                            </div>
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

/**
 * The function `populateList` populates a list of tournaments on a webpage, with an option to erase
 * the existing list before populating it.
 * @param erase - The `erase` parameter is a boolean value that determines whether the existing content
 * of the ".tournamentsList" element should be erased before populating it with new data. If `erase` is
 * `true`, the content will be erased; if `erase` is `false`, the new data will
 * @returns The function does not have a return statement.
 */
    populateList(erase){
        if (this.flag)
            return ;
        else
            this.flag = true
        if (this.endTournament)
            return ;
        if (erase)
            document.querySelector(".tournamentsList").innerHTML = "";
        API.getTournamentsList(1, this.page, this.size, this.options).then(tournaments=>{
            if (tournaments.next == null){
                this.endTournament = true;
                this.page = -1;
            }
            else 
                this.page++;
            if (tournaments.results == undefined)
                return ;
            tournaments.results.forEach(element => {
                document.querySelector(".tournamentsList").innerHTML += this.getTournamentCard(element);
            });
            this.flag = false;
        }).catch(e=>{
            console.log(e)
        })
    }

	setup(){
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpeg");
        this.populateList(1)

        /* This line of code is adding an event listener to the element with the class "tournamentsList". When
        that element is clicked, it will trigger the "handleTournamentSubscription" function from the
        "listeners" module, passing in the current instance of the class as an argument. The "bind" method
        is used to bind the "this" value to null, meaning that the "this" value inside the
        "handleTournamentSubscription" function will be undefined. */
        document.querySelector(".tournamentsList").addEventListener("click", listeners.handleTournamentSubscription.bind(null, this))

        /* This line of code is adding an event listener to the element with the class "showNewTournamentForm".
        When that element is clicked, it will trigger the "exposeNewTournamentForm" function from the
        "listeners" module. */
        document.querySelector(".showNewTournamentForm").addEventListener("click", listeners.exposeNewTournamentForm)
        
        /* This line of code is adding an event listener to the element with the class "createTournamentBtn".
        When that element is clicked, it will trigger the "handleTournamentCreation" function from the
        "listeners" module, passing in the current instance of the class as an argument. The "bind" method
        is used to bind the "this" value to null, meaning that the "this" value inside the
        "handleTournamentCreation" function will be undefined. */
        document.querySelector(".createTournamentBtn").addEventListener("click", listeners.handleTournamentCreation.bind(null, this));

        /* This line of code is adding an event listener to the button element with the class
        "displayNameAndSubmit". When that button is clicked, it will trigger the "handleTournamentSubscribe"
        function from the "listeners" module, passing in the current instance of the class as an argument.
        The "bind" method is used to bind the "this" value to null, meaning that the "this" value inside the
        "handleTournamentSubscribe" function will be undefined. */
        document.querySelector(".displayNameAndSubmit button").addEventListener("click", listeners.handleTournamentSubscribe.bind(null, this))


        /* This line of code is adding an event listener to the "restoreBtn" element. When the button is
        clicked, it will trigger the "handleRestoreBtn" function from the "listeners" module, passing in the
        current instance of the class as an argument. The "bind" method is used to bind the "this" value to
        null, meaning that the "this" value inside the "handleRestoreBtn" function will be undefined. */
        document.querySelector(".restoreBtn").addEventListener("click", listeners.handleRestoreBtn.bind(null, this));

        /* This line of code is adding an event listener to the element with the class "search". When that
        element is clicked, it will trigger the "handleSearchBtn" function from the "listeners" module,
        passing in the current instance of the class as an argument. The "bind" method is used to bind the
        "this" value to null, meaning that the "this" value inside the "handleSearchBtn" function will be
        undefined. */
        document.querySelector(".search").addEventListener("click", listeners.handleSearchBtn.bind(null, this))

        /* This line of code is adding an event listener to the element with the class "tournamentsList". When
        the user scrolls within this element, it will trigger the "handleTournamentsListScroll" function
        from the "listeners" module, passing in the current instance of the class as an argument. The "bind"
        method is used to bind the "this" value to null, meaning that the "this" value inside the
        "handleTournamentsListScroll" function will be undefined. */
        document.querySelector(".tournamentsList").addEventListener("scroll", listeners.handleTournamentsListScroll.bind(null, this))
    }
}