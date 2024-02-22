import Aview from "/views/abstractView.js";
import Router from "/router/mainRouterFunc.js"
import * as API from "/API/APICall.js"


export default class extends Aview{
    constructor(){
        super();
    }
    getHtml(){
        return `
        <div class="base">
        </div>
    `
    }
    setup(){
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpeg")
        const urlParams = new URLSearchParams(window.location.search)

        if (urlParams.get("code") != null)
        {
            let url = window.location.href;

            if (localStorage.getItem("loginWithGoogle") == "true")
            {
                API.googleLogin(1, urlParams.get("code"), urlParams.get("state")).then(res=>{
                    localStorage.removeItem("loginWithGoogle");
                    window.goHome();
                }).catch(e=>{
                    console.log(e)
                })
                return ;
            }

            if (url.indexOf("intra") != -1){
                if (localStorage.getItem("intraLogin") == undefined){
                    API.linkIntraAccount(1, urlParams.get("code"), urlParams.get("state")).then(res=>{
                        // document.querySelector(".intra").style.backgroundColor = "var(--bs-success)"
                        localStorage.setItem("intraLinked", "true")
                        history.pushState(null, null, "/account/");
                        Router();
                    }).catch(e=>{
                        console.log(e)
                    })
                }
                else{
                    API.convertIntraToken(urlParams.get("code"), urlParams.get("state")).then(res=>{
                        history.pushState(null, null, "/");
                        localStorage.removeItem("intraLogin")
                        Router();
                    }).catch(e=>{
                        console.log(e)
                    })
                }
            }
            else{
                API.linkGoogleAccount(1, urlParams.get("code"), urlParams.get("state")).then(res=>{
                    // document.querySelector(".google").style.backgroundColor = "var(--bs-success)"
                    localStorage.setItem("googleLinked", "true")
                    history.pushState(null, null, "/account/");
                    Router();
                }).catch(e=>{
                    console.log(e)
                })
            }
        }
	}
}