import * as API from"/API/APICall.js"
import * as helpFunction from "/viewScripts/matchHistory/listenersHelperFunctions.js"

function addSpinner(){
    return `
        <div class="spinner-border tournamentsSpinner text-success" style="border-radius: 50% !important" role="status">
        </div>
    `
}

function makePopoverTarget(username, displayName){
    let popContainer = document.createElement("a");
    let popContent = document.createElement("div");
    let text = document.createElement("span")

    popContainer.href = `/user/?username=${username}`;
    popContainer.setAttribute("data-link", "")
    popContainer.classList.add("popover-container");
    popContent.classList.add("popover-content");
    text.textContent = displayName;

    popContent.appendChild(text);
    popContainer.appendChild(popContent);
    return popContainer;
}

function createTournamentImage(obj, bracket){
    let image = document.createElement("img");
    let imageWrap = document.createElement("div");
    let popoverEl = makePopoverTarget(obj.username, obj.display_name);
    let firstPopChild = popoverEl.firstChild;

    image.src = obj.picture ?? "/imgs/defaultImg.jpg";
    if (obj.empty == true)
        image.classList.add("tournamentImageEmpty");
    else
        image.classList.add("tournamentImage");
    imageWrap.classList.add("tournamentImageWrap");
    imageWrap.classList.add("popover-trigger");

    if (obj.winner)
        imageWrap.setAttribute("winner", "true")
    else
        imageWrap.setAttribute("winner", "false")
    imageWrap.appendChild(image);
    popoverEl.insertBefore(imageWrap, firstPopChild)
    bracket.appendChild(popoverEl);
}

function getCrown(){
    let image = document.createElement("img");

    image.src = "/imgs/toonCrown.png";
    image.classList.add("crown");
    return (image)
}

function checkForEmptyUser(tournaments){
    tournaments.forEach(obj=>{
        if (obj.empty == true){
            obj.username = null;
            obj.display_name = "Nobody Show Up";
            obj.picture = "/imgs/warning.png";
            obj.winner = false;
        }
    })
}

function handleCanvas(tournament){
    let iterations = tournament.length;
    let partecipants = tournament[0].length;
    let bracketSize = (document.querySelector(".matchInfoContainer").clientWidth / (partecipants / 2));

    for (let i = 0; i < iterations; i++){
        let divContainer = document.createElement("div");

        divContainer.classList.add("bracketLine")
        divContainer.style.height = `${(document.querySelector(".matchInfoContainer").clientHeight / iterations)}px`
        checkForEmptyUser(tournament[i]);
        for (let j = 0; j < tournament[i].length; j += 2){
            let bracket = document.createElement("div");

            bracket.classList.add("bracket");
            bracket.style.height = `${bracketSize / 2}px`;
            createTournamentImage(tournament[i][j], bracket);
            if (tournament[i][j + 1] != undefined){
                createTournamentImage(tournament[i][j + 1], bracket);
                bracket.style.width = `${bracketSize}px`
            }
            else{
                bracket.appendChild(getCrown())
                bracket.style.width = `${bracket / 2}px`
                bracket.setAttribute("tournamentWinner", "true")
            }
            divContainer.appendChild(bracket);
        }
        bracketSize += 15;
        partecipants /= 2;
        document.querySelector(".drawMatch").appendChild(divContainer);
    }
}

export function handleTournamentHistory(dupThis, e){
    let card = document.querySelector(".matchInfoContainer");

    if (e.target.classList.contains("matchDetails")){
        if (!e.target.classList.contains("bodyOpened")){
            helpFunction.movementHandler("open", card);
            document.querySelector(".drawMatch").innerHTML = "";
            document.querySelector(".drawMatch").style.display = "none";
            if (document.querySelector(".tournamentsSpinner") == undefined)
                document.querySelector(".matchInfoContainer").innerHTML += addSpinner();
            else
                document.querySelector(".tournamentsSpinner").style.display = "flex"
            setTimeout(() => {
                API.getTournamentInfo(1, e.target.getAttribute("tournamentId")).then(res=>{
                    document.querySelector(".tournamentsSpinner").style.display = "none";
                    document.querySelector(".drawMatch").style.display = "flex";
                    handleCanvas(res);
                })
            }, 350);
        }
        else
            helpFunction.movementHandler("close", card);
        helpFunction.resetBtnClass(e.target);
        e.target.classList.toggle("bodyOpened");
    }
    if (e.target.classList.contains("unSubscribe")){
        helpFunction.resetBtnClass(e.target);
        helpFunction.movementHandler("close", card);
    }
}