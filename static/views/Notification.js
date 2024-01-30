import Aview from "/views/abstractView.js"

export default class extends Aview{
    constructor(){
        super();
    }

    getHtml(){
        return  `
            <div class="base">
                <div class="notificationContainer">

                </div>
            </div>
        `
    }

    setup(){

    }

}