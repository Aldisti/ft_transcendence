import Aview from "/views/abstractView.js";
import language from "/language/language.js"

export default class extends Aview{
    constructor(){
		super();
		this.needListener	= true;
		this.listenerId		= "signupBtn";
    }
    getHtml(){
        return `
		<div class="base">
			<div class="signupForm">
				<h1 id="title">${language.en.register.register}</h1>
				<div class="line">
					<h3>${language.en.register.name}</h3>
					<input type="text" class="data retroShade" name="name">
				</div>
				<div class="line">
					<h3>${language.en.register.email}</h3>
					<input type="email" class="data retroShade" name="email">
				</div>
				<div class="line">
					<h3>${language.en.register.password}</h3>
					<input type="password" class="data retroShade" name="password">
				</div>
				<div class="line">
					<h3>${language.en.register.confirmPassword}</h3>
					<input type="password" class="data retroShade" name="ConfirmPassword">
				</div>
				<div class="linebtn">
					<a class="retroShade retroBtn btnColor-yellow" href="/login" data-link>${language.en.register.login}</a>
					<button id="signupBtn" class="retroShade retroBtn btnColor-green">${language.en.register.submit}</button>
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