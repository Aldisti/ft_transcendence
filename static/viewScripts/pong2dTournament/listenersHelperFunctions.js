export function movementHandler(newState, obj){
    if (newState === "close"){
        document.querySelector(".tournamentManager").style.width = "47svw"
        obj.classList.remove("showCard")
    }
    else if (newState === "open"){
        document.querySelector(".tournamentManager").style.width = "90%"
        obj.classList.add("showCard");
    }
}

export function resetBtnClass(currentEl){
    document.querySelectorAll(".subscribe").forEach(el=>{
        if (currentEl === undefined || el !== currentEl)
            el.classList.remove("bodyOpened")
    })
}

export function getCardBody(el){

    while(!el.classList.contains("tournamentCard")){
        el = el.parentNode;
    }
    return el.querySelector(".hiddenBody");
}

export function checkDate(obj, dupThis){
    let [hours, minutes] = obj.tTime.split(":");
    //one hour in milliseconds
    let margin = 3600000;
    let currDate = new Date();
    let inputDate = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate(), hours, minutes).getTime();
    let timeDelta = inputDate - currDate.getTime();

    if ( timeDelta < margin && timeDelta > 0)
        return (true);
    alert(dupThis.language.tournament.invalidDateTime)
    return (false);
}

export function fieldValidate(val, key, dupThis){
    let regLength = key == "tDescription" ? 300 : 20;
    let genericRegex = new RegExp(`^[A-Za-z0-9!?*@$~_ :-]{5,${regLength}}$`);
    let partecipantsRegex = /^[0-9]+$/;

    if (key == "tPartecipants"){
        if (partecipantsRegex.test(val))
            return (Number(val));
        else{
            alert(window.escapeHtml(val) + dupThis.language.tournament.invalidPartecipants)
            return (null);
        }
    }
    if (genericRegex.test(val))
        return (val);
    alert(window.escapeHtml(val) + dupThis.language.tournament.invalidInput)
    return (null);
}