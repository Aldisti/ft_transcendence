let possiblePartecipants = [4, 8, 16]

export function movementHandler(newState, obj){
    if (newState === "close"){
        document.querySelector(".matchManager").style.width = "32svw"
        obj.classList.remove("showCard")
    }
    else if (newState === "open"){
        document.querySelector(".matchManager").style.width = "100%"
        obj.classList.add("showCard");
    }
}

export function resetBtnClass(currentEl){
    document.querySelectorAll(".matchDetails").forEach(el=>{
        if (currentEl === undefined || el !== currentEl)
            el.classList.remove("bodyOpened")
    })
}
