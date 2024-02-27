import Aview from "/views/abstractView.js"
import * as API from "/API/APICall.js";
import * as notificationView from "/viewScripts/notification/notificationViewRouter.js";

export default class extends Aview{
    constructor(){
        super();
    }

    getHtml(){
        return  `
            <div class="base">
                <div class="firendRequestSection">
                    <div class="title">
                        <h1>${this.language.notification.friendSection}</h1>
                    </div>
                    <div class="friendRequestContainer">

                    </div>
                </div>
                <div class="infoSection">
                    <div class="title">
                        <h1>${this.language.notification.infoSection}</h1>
                    </div>
                    <div class="infoContainer">
                    </div>
                </div>
            </div>
        `
    }

    setup(){
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpeg");
        if (localStorage.getItem("notification") != null){
            let parsedNotification = JSON.parse(localStorage.getItem("notification"))
            
            //since the retrieved obj contain an array of notification this will loop trought it and decide what to do based on type
            for (let i = 0; i < parsedNotification.length; i++)
                notificationView.notificationRouter(parsedNotification[i]);
    
            notificationView.setuplistenerToRemoveNotification();
        }
    }
}