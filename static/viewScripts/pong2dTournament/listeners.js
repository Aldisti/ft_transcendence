import * as API from"/API/APICall.js"
import * as helpFunction from "/viewScripts/pong2dTournament/listenersHelperFunctions.js"
import Router from "/router/mainRouterFunc.js"

export function handleTournamentSubscription(dupThis, e){
    let card = document.querySelector(".displayBodyAndSubbmit");
    if (e.target.classList.contains("subscribe")){
        document.querySelector(".newTournament").classList.remove("showCard")
        if (!e.target.classList.contains("bodyOpened"))
            helpFunction.movementHandler("open", card);
        else
            helpFunction.movementHandler("close", card);
        document.querySelector(".displayBodyAndSubbmit .bodyContainer").innerHTML = helpFunction.getCardBody(e.target).innerHTML;
        helpFunction.resetBtnClass(e.target);
        e.target.classList.toggle("bodyOpened");
    }
    if (e.target.classList.contains("unSubscribe")){
        helpFunction.resetBtnClass(e.target);
        helpFunction.movementHandler("close", card);
        setTimeout(() => {
            if (confirm("Do You really want to unsubscribe dupThis event?")){
                API.unsubscribeTournament(1).then(res=>{
                    if (res)
                        alert(dupThis.language.tournament.tournamentUnSubscribed);
                    else
                        alert(dupThis.language.tournament.tournamentUnSubscribedError);
                    Router()
                })
            }
        }, 300);
    }
}

export function exposeNewTournamentForm(){
    let card = document.querySelector(".newTournament");

    document.querySelector(".displayBodyAndSubbmit").classList.remove("showCard");
    helpFunction.resetBtnClass();
    if (card.classList.contains("showCard")){
        helpFunction.movementHandler("close", card);
    }
    else{
        helpFunction.movementHandler("open", card);
    }
}

export function handleTournamentCreation(dupThis, e){
    if (!document.querySelector(".newTournament form").checkValidity()){
        return ;
    }
    e.preventDefault()
    let form = new FormData(document.querySelector(".newTournament form"));
    let flag = true;
    let obj = {};

    form.forEach((value, key)=>{
        obj[key] = helpFunction.fieldValidate(value, key, dupThis);
        if (obj[key] == null)
            flag = false;
    })
    if (!flag)
        return
    if (!helpFunction.checkDate(obj, dupThis)){
        return ;
    }
    API.createTournament(1, obj).then(res=>{
        if (res)
            alert(dupThis.language.tournament.tournamentCreated);
        else
            alert(dupThis.language.tournament.tournamentCreateError);
    })
    Router();
}

export function handleTournamentSubscribe (dupThis, e){
    let input = document.querySelector(".displayNameAndSubmit input");

    if (/^[A-Za-z0-9!?*@$~_-]{5,32}$/.test(input.value)){
        API.tournamentSubmit(1).then(res=>{
            if (res)
                alert(dupThis.language.tournament.tournamentSubmit);
            else
                alert(dupThis.language.tournament.tournamentSubmitError);
        })
    }
    else
        alert(this.language.tournament.displayNameError)
    Router();
}