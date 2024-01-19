let notificationCss = `
.notificationClose{
    position: absolute;
    padding: 15px;
    width: 10%;
    height: 30%;
    background-color: white;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 5px;
    right: 5px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset !important;
}

.notificationContainer{
    margin: 20px;
    background-color: var(--bs-dark);
    color: white;
    width: 30svw;
    height: fit-content;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    transform: translateX(-100%);
    animation: notificationSlide 0.5s ease-out;
    flex-direction: column;
    padding: 20px;
    justify-content: space-between;
    z-index: 10000000000000;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset !important;
}

.notificationTitle{
    width: 100%;
    height: fit-content;
    text-align: center;
}

.notificationBody{
    width: 100%;
    display: flex;
    justify-content: center;
    height: fit-content;
    margin: 20px 0 20px 0;

}

.notificationBtns{
    width: 100%;
    height: 5svh;
    display: flex;
    justify-content: space-between;
}

.notificationBtns button{
    height: 100%;
    width: 45%;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset !important;
    border: none;
}
`
var styleSheet = document.createElement("style")
styleSheet.innerText = notificationCss
document.head.appendChild(styleSheet)

function defaultChoiceCallback(notificationContent, notificationElement){
}
function defaultSimpleCallback(notificationContent, notificationElement){
}

export function choice(notificationContent, callback){
    let parser = new DOMParser();
    let notification = `
        <div class="notificationContainer">
            <h4>${notificationContent.title}</h4>
            <div class="notificationBody">
                <span>
                    ${notificationContent.body}
                </span>
            </div>
            <div class="notificationBtns">
                <button class="notificationBtn notificationDeny">
                    ${notificationContent.deny}
                </button>
                <button class="notificationBtn notificationAccept">
                    ${notificationContent.accept}
                </button>
            </div>
        </div>
    `
    let doc = parser.parseFromString(notification, 'text/html');
    let notificationElement = doc.body.firstChild;

    document.body.appendChild(notificationElement);
    setTimeout(() => {
        notificationElement.style.transform = "translateX(0%)"
    }, 500);
    if (callback == undefined)
        defaultChoiceCallback(notificationContent, notificationElement)
    else
        callback(notificationContent, notificationElement);
}

export function simple(notificationContent, callback){
    let parser = new DOMParser();
    let notification = `
        <div class="notificationContainer">
            <div class="notificationClose">
                X
            </div>
            <h4>${notificationContent.title}</h4>
            <div class="notificationBody">
                <span>
                    ${notificationContent.body}
                </span>
            </div>
        </div>
    `
    let doc = parser.parseFromString(notification, 'text/html');
    let notificationElement = doc.body.firstChild;

    setTimeout(() => {
        notificationElement.style.transform = "translateX(0%)"
    }, 500);
    if (callback != undefined)
        callback(notificationContent, notificationElement)
    else
        defaultSimpleCallback(notificationContent, notificationElement)
    document.body.appendChild(notificationElement);
    notificationElement.querySelector(".notificationClose").addEventListener("click", ()=>{
        document.body.removeChild(notificationElement);
    })
    setTimeout(() => {
        document.body.removeChild(notificationElement);
    }, 5000);
}