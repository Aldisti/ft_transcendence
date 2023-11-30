import Aview from "/views/abstractView.js";
import language from "/language/language.js"

export default class extends Aview{
    constructor(){
        super();
		this.needListener	= true;
		this.listenerId		= "loginBtn";
    }
    getHtml(){
        return `
		<div class="base">
        	<div class="loginForm">
            	<h1 id="title">${language.en.login.login}</h1>
            	<div class="line">
                	<h3>${language.en.login.name}</h3>
                	<input type="text" class="data retroShade" name="name">
            	</div>
            	<div class="line">
                	<h3>${language.en.login.password}</h3>
                	<input type="password" class="data retroShade" name="password">
            	</div>
            	<div class="linebtn">
                	<a class="retroBtn retroShade btnColor-yellow" href="/signup" data-link>${language.en.login.register}</a>
                	<button id="loginBtn" class="retroBtn retroShade btnColor-green">${language.en.login.submit}</button>
            	</div>
        	</div>
   		</div>
        `
    }
	setBackground(){
		document.querySelector("#app").style.backgroundImage = "url('/imgs/backLogin.png')";
		document.querySelector("#app").style.backgroundSize = "cover"
		document.querySelector("#app").style.backgroundRepeat = "repeat"
	}
}