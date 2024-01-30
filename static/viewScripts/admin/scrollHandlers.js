import * as API from "/API/APICall.js"

let pageSize = 10;
let pageCounter = [0, 0, 0];

export function handleUsersScroll(dupThis, obj, e){
    let containerNumber = obj.getAttribute("containerNumber");

    console.log(e, e.target)
    if (obj.scrollHeight - obj.scrollTop === obj.clientHeight) {
        API.getDummyUsers(1, pageSize, pageCounter[containerNumber]++).then(res=>{
            if (res.results == undefined)
            {
                console.log("heyyy")
                document.querySelectorAll(".usersContainer")[containerNumber].classList.add("applyEndUsers");
                setTimeout(() => {
                    document.querySelectorAll(".usersContainer")[containerNumber].classList.remove("applyEndUsers");
                }, 1300);
                return;
            }
            res.results.forEach(element => {
                if (containerNumber == 0)
                    obj.innerHTML += dupThis.createUser({username: element.username, picture: element.user_info.picture});
                if (containerNumber == 1)
                    obj.innerHTML += dupThis.createModerator({username: element.username, picture: element.user_info.picture});
                if (containerNumber == 2)
                    obj.innerHTML += dupThis.createBannedUser({username: element.username, picture: element.user_info.picture});
            });
        })
    }
}

export function handleUserSearch(dupThis, obj, e){
    let input = e.target.parentNode.childNodes[1];
    let containerNumber = obj.getAttribute("containerNumber");

    API.getUserInfo(input.value).then(element=>{
        if (element == undefined){
            input.classList.add("animateWrongInput");
            setTimeout(() => {
                input.classList.remove("animateWrongInput");
            }, 700);
            return;
        }
        if (containerNumber == 0)
            obj.innerHTML = dupThis.createUser({username: element.username, picture: element.user_info.picture});
        if (containerNumber == 1)
            obj.innerHTML = dupThis.createModerator({username: element.username, picture: element.user_info.picture});
        if (containerNumber == 2)
            obj.innerHTML = dupThis.createBannedUser({username: element.username, picture: element.user_info.picture});
    })
}

export function handleRestore(dupThis, obj, e){
    let containerNumber = obj.getAttribute("containerNumber");

    obj.innerHTML = "";
    API.getDummyUsers(1, pageSize, pageCounter[containerNumber]++).then(res=>{
        console.log(res)
        res.results.forEach(element => {
            if (containerNumber == 0)
                obj.innerHTML += dupThis.createUser({username: element.username, picture: element.user_info.picture});
            if (containerNumber == 1)
                obj.innerHTML += dupThis.createModerator({username: element.username, picture: element.user_info.picture});
            if (containerNumber == 2)
                obj.innerHTML += dupThis.createBannedUser({username: element.username, picture: element.user_info.picture});
        });
    })  
}

