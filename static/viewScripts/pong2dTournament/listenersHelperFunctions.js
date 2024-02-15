let possiblePartecipants = [4, 8, 16]

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

export function fieldValidate(val, key, dupThis){
    let regLength = key == "tDescription" ? 255 : 32;
    let genericRegex = new RegExp(`^[A-Za-z0-9!?*()$~_ :.;,-]{5,${regLength}}$`);
        let partecipantsRegex = /^[0-9]+$/;

    if (key == "tPartecipants"){
        if (partecipantsRegex.test(val) && possiblePartecipants.includes(Number(val))){
            document.getElementsByName(key)[0].style.backgroundColor = "white";
            return (Number(val));
        }
        else{
            document.getElementsByName(key)[0].style.backgroundColor = "var(--bs-danger)";
            return (null);
        }
    }
    document.getElementsByName(key)[0].style.backgroundColor = "white";
    if (genericRegex.test(val))
        return (val);
    console.log(key)
    document.getElementsByName(key)[0].style.backgroundColor = "var(--bs-danger)";
    return (null);
}