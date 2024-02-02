import * as API from "/API/APICall.js"

let pageSize = 10;
let pageCounter = [0, 0, 0];

function endAnimation(res, containerNumber){
    if (res.results == undefined)
    {
        document.querySelectorAll(".usersContainer")[containerNumber].classList.add("applyEndUsers");
        setTimeout(() => {
            document.querySelectorAll(".usersContainer")[containerNumber].classList.remove("applyEndUsers");
        }, 1300);
        return true;
    }
    return false
}

export function handleUsersScroll(dupThis, obj, e){
    let containerNumber = obj.getAttribute("containerNumber");

    if (obj.scrollHeight - obj.scrollTop === obj.clientHeight) {
        if (containerNumber == 0){
            API.adminGetUsers(1, pageCounter[containerNumber]++, pageSize).then(res=>{
                if (endAnimation(res, containerNumber))
                    return ;
                res.results.forEach(element => {
                obj.innerHTML += dupThis.createUser({username: element.username, picture: element.user_info.picture});
                })
            });
        }
        if (containerNumber == 1){
            API.adminGetModerator(1, pageCounter[containerNumber]++, pageSize).then(res=>{
                if (endAnimation(res, containerNumber))
                    return ;
                res.results.forEach(element => {
                    obj.innerHTML += dupThis.createModerator({username: element.username, picture: element.user_info.picture});
                })
            })
        }
        if (containerNumber == 2){
            API.adminGetBannedUsers(1, pageCounter[containerNumber]++, pageSize).then(res=>{
                if (endAnimation(res, containerNumber))
                    return ;
                res.results.forEach(element => {
                    obj.innerHTML += dupThis.createBannedUser({username: element.username, picture: element.user_info.picture});
                })
            })
        }
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
    pageCounter[containerNumber] = 1;
    if (containerNumber == 0){
        API.adminGetUsers(1, pageCounter[containerNumber]++, pageSize).then(res=>{
            res.results.forEach(element => {
            obj.innerHTML += dupThis.createUser({username: element.username, picture: element.user_info.picture});
            })
        });
    }
    if (containerNumber == 1){
        API.adminGetModerator(1, pageCounter[containerNumber]++, pageSize).then(res=>{
            res.results.forEach(element => {
                obj.innerHTML += dupThis.createModerator({username: element.username, picture: element.user_info.picture});
            })
        })
    }
    if (containerNumber == 2){
        API.adminGetBannedUsers(1, pageCounter[containerNumber]++, pageSize).then(res=>{
            console.log(res)
            res.results.forEach(element => {
                obj.innerHTML += dupThis.createBannedUser({username: element.username, picture: element.user_info.picture});
            })
        })
    }
}

