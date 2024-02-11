import * as API from"/API/APICall.js"
import * as helpFunction from "/viewScripts/matchHistory/listenersHelperFunctions.js"
import Router from "/router/mainRouterFunc.js"


let tournament = [
    [{username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "test", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}],
    [{username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}],
    [{username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}, {username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}],
    [{username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}, {username: "gpanico", winner: false, picture: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"}],
    [{username: "mpaterno", winner: true, picture: "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"}],
]

let imageId = 0

function makePopoverTarget(username){
    let popContainer = document.createElement("div");
    let popContent = document.createElement("div");
    let text = document.createElement("span")

    popContainer.classList.add("popover-container");
    popContent.classList.add("popover-content");
    text.textContent = username

    popContent.appendChild(text);
    popContainer.appendChild(popContent);
    return popContainer;
}

function createTournamentImage(obj, bracket){
    let image = document.createElement("img");
    let imageWrap = document.createElement("div");
    let popoverEl = makePopoverTarget(obj.username);
    let firstPopChild = popoverEl.firstChild;

    image.src = obj.picture;
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

function handleCanvas(tournament){
    let iterations = tournament.length;
    let partecipants = tournament[0].length;
    let bracketSize = (document.querySelector(".matchInfoContainer").clientWidth / (partecipants / 2));

    for (let i = 0; i < iterations; i++){
        let divContainer = document.createElement("div");

        divContainer.classList.add("bracketLine")
        divContainer.style.height = `${(document.querySelector(".matchInfoContainer").clientHeight / iterations)}px`

        for (let j = 0; j < tournament[i].length; j += 2){
            let bracket = document.createElement("div");

            bracket.classList.add("bracket");
            bracket.style.height = `${bracketSize / 2}px`
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

export function handleTournamentSubscription(dupThis, e){
    let card = document.querySelector(".matchInfoContainer");

    if (e.target.classList.contains("matchDetails")){
        if (!e.target.classList.contains("bodyOpened")){
            helpFunction.movementHandler("open", card);
            setTimeout(() => {
                handleCanvas(tournament)
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