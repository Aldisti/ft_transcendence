import Aview from "/views/abstractView.js";
import language from "/language/language.js";
import login from"/API/login.js"

export default class extends Aview{
    constructor(){
        super();
		this.needListener	= true;
		this.listenerId		= "loginBtn";
		this.fiels			= {};
    }
    getHtml(){
        return `
		<div class="base">
        	<div class="loginForm">
            	<h1 id="title">${this.language.login.login}</h1>
            	<div class="line">
                	<h3>${language.en.login.name}</h3>
                	<input type="text" class="data retroShade" name="name">
            	</div>
            	<div class="line">
                	<h3>${this.language.login.password}</h3>
                	<input type="password" class="data retroShade" name="password">
            	</div>
            	<div class="linebtn">
                	<a class="retroBtn retroShade btnColor-yellow" href="/signup" data-link>${this.language.login.register}</a>
                	<button id="loginBtn" class="retroBtn retroShade btnColor-green">${this.language.login.submit}</button>
            	</div>
        	</div>
   		</div>
        `
    }
	setup(){
		window.addEventListener("click", (e)=>{
			if (e.target.id == "loginBtn")
			{
				this.updateField(this.getInput());
				console.log(this.field)//call API
				login(this.field)
			}
		})
		if (localStorage.getItem("style") == "modern")
		document.querySelector("#app").style.backgroundImage = "url('https://c4.wallpaperflare.com/wallpaper/105/526/545/blur-gaussian-gradient-multicolor-wallpaper-preview.jpg')";
		else
			document.querySelector("#app").style.backgroundImage = "url('/imgs/backLogin.png')";
		document.querySelector("#app").style.backgroundSize = "cover"
		document.querySelector("#app").style.backgroundRepeat = "repeat"
	}
	
}