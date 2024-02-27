import * as API from"/API/APICall.js"
import * as helpFunction from "/viewScripts/pong2dTournament/listenersHelperFunctions.js"
import Router from "/router/mainRouterFunc.js"

function handleTournamentSubScriptionMobile(dupThis, id){
    let input = prompt("Enter Display Name");

    if (/^[A-Za-z0-9!?*@$~_-]{5,32}$/.test(input)){
        API.tournamentSubmit(1, input, id).then(res=>{
            if (!res)
                alert(dupThis.language.tournament.tournamentSubmitError);
            Router();
        }).catch(e=>{
            console.log(e)
        })
    }
    else
        alert("Bad Input");
}

/**
 * The function handles the subscription and unsubscription of a user to a tournament, displaying a
 * confirmation message and updating the UI accordingly.
 * @param dupThis - The parameter `dupThis` is likely an object or instance of a class that contains
 * properties and methods related to the current context or state of the application. It is being used
 * to access properties such as `dupThis.language.tournament.tournamentUnSubscribed` and
 * `dupThis.language.tournament.t
 * @param e - The parameter "e" is an event object that represents the event that triggered the
 * function. It is typically passed as an argument when an event listener is invoked. In this case, it
 * is used to access the target element that triggered the event and retrieve its attributes and class
 * names.
 */
export function handleTournamentSubscription(dupThis, e){
    let card = document.querySelector(".displayBodyAndSubbmit");
    let tournamentId = e.target.getAttribute("tournamentId");

    if (e.target.classList.contains("subscribe")){
        if (window.innerWidth < 900){
            handleTournamentSubScriptionMobile(dupThis, e.target.getAttribute("tournamentId"))
            return ;
        }
        document.querySelector(".newTournament").classList.remove("showCard")
        if (!e.target.classList.contains("bodyOpened")){
            helpFunction.movementHandler("open", card);
            document.querySelector(".submitter").setAttribute("tournamentId", tournamentId)
        }
        else
            helpFunction.movementHandler("close", card);
        helpFunction.resetBtnClass(e.target);
        e.target.classList.toggle("bodyOpened");
    }
    if (e.target.classList.contains("unSubscribe")){
        if (window.innerWidth >= 900){
            helpFunction.resetBtnClass(e.target);
            helpFunction.movementHandler("close", card);
        }
        setTimeout(() => {
            if (confirm("Do You really want to unsubscribe this event?")){
                API.unsubscribeTournament(1, e.target.getAttribute("tournamentId")).then(res=>{
                    if (!res)
                        alert(dupThis.language.tournament.tournamentUnSubscribedError);
                    Router()
                }).catch(e=>{
                    console.log(e)
                })
            }
        }, 300);
    }
}

/**
 * The function exposes a new tournament form by toggling its visibility.
 */
export function exposeNewTournamentForm(){
    let card = document.querySelector(".newTournament");

    if (window.innerWidth < 900){
        alert("Only available in DESKTOP mode");
        return ;
    }

    document.querySelector(".displayBodyAndSubbmit").classList.remove("showCard");
    helpFunction.resetBtnClass();
    if (card.classList.contains("showCard")){
        helpFunction.movementHandler("close", card);
    }
    else{
        helpFunction.movementHandler("open", card);
    }
}

function validateDateTime(dateTimeString){
    // Parse the input datetime string into a Date object
    const inputDateTime = new Date(dateTimeString);

    // Get the current datetime
    const currentDateTime = new Date();

    // Calculate the time difference in milliseconds between input and current datetime
    const timeDifference = inputDateTime.getTime() - currentDateTime.getTime();

    // Check if the time difference is at least one hour (in milliseconds)
    return timeDifference >= 5 * 60 * 1000;
}

/**
 * The function handles the creation of a tournament by validating form data, creating an object with
 * the data, and making an API call to create the tournament.
 * @param dupThis - The `dupThis` parameter is likely referring to the current context or instance of
 * the object that contains this function. It could be used to access properties or methods of that
 * object within the function.
 * @param e - The parameter "e" is an event object that is passed to the function when it is called. It
 * is typically used to access information about the event that triggered the function, such as the
 * target element or the event type. In this case, it is used to prevent the default form submission
 * behavior by
 * @returns nothing (undefined) if the form is not valid or if the flag is false.
 */
export function handleTournamentCreation(dupThis, e){
    if (!document.querySelector(".newTournament form").checkValidity()){
        return ;
    }
    e.preventDefault()
    let form = new FormData(document.querySelector(".newTournament form"));
    let dateTime = form.get("tDate") + "T" + form.get("tTime");
    let flag = true;
    let obj = {};

    form.forEach((value, key)=>{
        if (key != "tTime" && key != "tDate"){
            obj[key] = helpFunction.fieldValidate(value, key, dupThis);
            if (obj[key] == null)
                flag = false;
        }
    })
    if (validateDateTime(dateTime)){
        obj["tDateTime"] = dateTime;
    }
    else{
        flag = false;
        alert("date and time must be later than 5 minutes from now...")
    }
    if (!flag)
        return
    API.createTournament(1, obj).then(res=>{
        if (!res)
            alert(dupThis.language.tournament.tournamentCreateError);
        Router();
    }).catch(e=>{
        console.log(e)
    })
}

/**
 * The function `handleTournamentSubscribe` handles the submission of a tournament subscription form by
 * validating the input and making an API call to submit the subscription.
 * @param dupThis - The `dupThis` parameter is likely a reference to the current context or instance of
 * the object that contains this function. It could be used to access properties or methods of that
 * object within the function.
 * @param e - The parameter `e` is an event object that is passed to the function when it is called. It
 * is typically used to access information about the event that triggered the function, such as the
 * target element or any data attributes associated with it. In this case, `e` is used to get the
 */
export function handleTournamentSubscribe (dupThis, e){
    let input = document.querySelector(".displayNameAndSubmit input");
    let tournamentId = e.target.getAttribute("tournamentId");

    if (/^[A-Za-z0-9!?*@$~_-]{5,32}$/.test(input.value)){
        API.tournamentSubmit(1, input.value, tournamentId).then(res=>{
            if (!res)
                alert(dupThis.language.tournament.tournamentSubmitError);
            Router();
        }).catch(e=>{
            console.log(e)
        })
    }
    else
        input.style.backgroundColor = "var(--bs-danger)";
}

/**
 * The function `handleRestoreBtn` resets certain properties of an object and calls another function to
 * populate a list.
 * @param dupThis - The parameter `dupThis` is an object that represents the current state of the
 * application or a specific component. It is being passed into the `handleRestoreBtn` function as an
 * argument.
 */
export function handleRestoreBtn(dupThis){
    dupThis.page = 1;
    dupThis.endTournament = false;
    dupThis.options.title = "";
    dupThis.options.participants = "";
    dupThis.populateList(1);
}

/**
 * The function `handleSearchBtn` takes user input for title and participants, updates the options
 * object with the search parameters, and calls the `populateList` function to display the search
 * results.
 * @param dupThis - The `dupThis` parameter is an object that contains various properties and methods.
 * It is being used to update and manipulate the state of the current page or component.
 */
export function handleSearchBtn(dupThis){
    let title = document.querySelector(".tournamentsTitle input").value
    let participants = document.querySelector(".tournamentsTitle select").value
    
    dupThis.page = 1;
    dupThis.endTournament = false;
    dupThis.options.title = `&title=${title}`;
    dupThis.flag = false;
    if (participants != "all")
        dupThis.options.participants = `&participants=${participants}`;
    else
        dupThis.options.partecipants = "";
    dupThis.populateList(1)
}

/**
 * The function `handleTournamentsListScroll` checks if the user has scrolled to the bottom of a list
 * and calls a function to populate more items if so.
 * @param dupThis - The `dupThis` parameter is a reference to an object that has a `populateList`
 * method.
 */
export function handleTournamentsListScroll(dupThis){
    let tournamentsList = document.querySelector(".tournamentsList");

    if ((tournamentsList.scrollHeight - tournamentsList.scrollTop - tournamentsList.clientHeight) <= 2){
        dupThis.populateList(0)
    }
}