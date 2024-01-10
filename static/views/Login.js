import Aview from "/views/abstractView.js";
import language from "/language/language.js";
import * as API from "/API/APICall.js"
import sha256 from "/scripts/crypto.js"

export default class extends Aview {
    constructor() {
        super();
        this.needListener = true;
        this.listenerId = "loginBtn";
        this.field = {};
    }
    getHtml() {
        return `
		<div class="base">
        	<div class="loginForm">
            	<h1 id="title">${this.language.login.login}</h1>
            	<div class="line">
                	<h4>${language.en.login.name}</h4>
                	<input type="text" class="data retroShade" name="username">
            	</div>
            	<div class="line">
                	<h4>${this.language.login.password}</h4>
					<div class="passInp">
						<input size="small" type="password" class="data retroShade" name="password">
                    	<div onclick="window.switchVisibility(this)" class="passwordSwitch">
                    	    <img src="/imgs/openEye.png" alt="">
                    	</div>
                	</div>
            	</div>
            	<div class="linebtn">
                	<a class="retroBtn retroShade btnColor-yellow" href="/signup" data-link>${this.language.login.register}</a>
                	<a class="retroBtn intraBtn retroShade btnColor-blue" href="#">${this.language.login.intraLogin}</a>
                	<button id="loginBtn" class="retroBtn retroShade btnColor-green">${this.language.login.submit}</button>
            	</div>
        	</div>
   		</div>
        `
    }
    setup() {
        API.convertIntraToken().then(res=>{
            if (!res)
            {
                API.getIntraUrl("login").then((url) => {
                    document.querySelector(".intraBtn").href = url;
                })
                window.addEventListener("click", (e) => {
                    if (e.target.id == "loginBtn") {
                        this.updateField(this.getInput());
                        this.field.password = sha256(this.field.password)
                            // this.field.password = this.field.password //for testing
                        API.login(this.field);
                    }
                })
                if (localStorage.getItem("style") == "modern")
                    document.querySelector("#app").style.backgroundImage = "url('https://c4.wallpaperflare.com/wallpaper/105/526/545/blur-gaussian-gradient-multicolor-wallpaper-preview.jpg')";
                else
                    document.querySelector("#app").style.backgroundImage = "url('/imgs/backLogin.png')";
                document.querySelector("#app").style.backgroundSize = "cover"
                document.querySelector("#app").style.backgroundRepeat = "repeat"
            }

        })
    }

}