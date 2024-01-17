import * as API from "/API/APICall.js";

Notification.requestPermission().then((permission) => {
    if (permission !== "granted") {
    }
});

export function atachNotification(notificationObj, conf, permanent){
    console.log(notificationObj)
    let parser = new DOMParser();
    let notification = `
        <div class="notificationContainer">
            <div class="notificationClose">
                X
            </div>
            ${conf.title !== undefined ? `<h4>${conf.title}</h4>` : ``}
            <div class="notificationBody">
                <span>
                    ${notificationObj.body}
                </span>
            </div>
            ${conf.option !== undefined ? `
            <div class="notificationBtns">
                <button class="notificationBtn notificationDeny">
                    ${conf.option.deny}
                </button>
                <button class="notificationBtn notificationAccept">
                    ${conf.option.accept}
                </button>
            </div>
            `: ``}
        </div>
    `
    let doc = parser.parseFromString(notification, 'text/html');
    let notificationElement = doc.body.firstChild;

    document.body.appendChild(notificationElement);
    if (permanent != undefined)
        notificationElement.querySelector(".notificationClose").addEventListener("click", ()=>{
            document.body.removeChild(notificationElement);
        })
    if (permanent == undefined)
    {
        setTimeout(() => {
            document.body.removeChild(notificationElement)
        }, 5000);
    }
    if (conf.option != undefined){
        notificationElement.querySelector(".notificationAccept").addEventListener("click", ()=>{
            API.acceptRequest(1, notificationObj.token)
            document.body.removeChild(notificationElement);
        })
        notificationElement.querySelector(".notificationDeny").addEventListener("click", ()=>{
            API.denyRequest(1, notificationObj.token)
            document.body.removeChild(notificationElement);
        })
    }
}

export function simpleNotification(title, body){
    let parser = new DOMParser();
    let notification = `
        <div class="notificationContainer">
            <div class="notificationClose">
                X
            </div>
            <h4>${title}</h4>
            <div class="notificationBody">
                <span>
                    ${body}
                </span>
            </div>
        </div>
    `
    let doc = parser.parseFromString(notification, 'text/html');
    let notificationElement = doc.body.firstChild;

    document.body.appendChild(notificationElement);
    setTimeout(() => {
        document.body.removeChild(notificationElement);
    }, 2000);
}