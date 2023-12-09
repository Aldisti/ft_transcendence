import Aview from "/views/abstractView.js";
import register from"/API/register.js"
import * as check from "/viewScripts/register/checks.js"
import sha256 from "/scripts/crypto.js"

export default class extends Aview{
    constructor(){
		super();
		this.needListener	= true;
		this.listenerId		= "signupBtn";
		this.errors			= {
			firstName: {isValid: false, text: ""},
			lastName:  {isValid: false, text: ""},
			username: {isValid: false, text: ""},
			email: {isValid: false, text: ""},
			password: {isValid: false, text: ""},
			confirmPassword: {isValid: false, text: ""},
			birthDate: {isValid: false, text: ""},
		}
		this.field			= {
			firstName: "",
			lastName: "",
			username: "",
			email: "",
		};
    }
    getHtml(){
        return `
		<div class="base">
			<div class="signupForm">
				<h1 id="title">${this.language.register.register}</h1>
				<div class="line">
				<div class="myTooltip">
				?
				<span id="firstName-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
			  </div> 
					<h2>${this.language.register.firstName[0]}</h2>
					<input type="text" value="${this.field[this.language.register.firstName[1]]}" class="data retroShade" name="${this.language.register.firstName[1]}">
				</div>
				<div class="line">
				<div class="myTooltip">
				?
				<span id="lastName-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
			  </div> 
					<h2>${this.language.register.lastName[0]}</h2>
					<input type="text" value="${this.field[this.language.register.lastName[1]]}" class="data retroShade" name="${this.language.register.lastName[1]}">
				</div>
				<div class="line">
				<div class="myTooltip">
					?
					<span id="username-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
				  </div> 
					<h2>${this.language.register.username[0]}</h2>
					<input type="text" value="${this.field[this.language.register.username[1]]}" class="data retroShade" name="${this.language.register.username[1]}">
				</div>
				<div class="line">
				<div class="myTooltip">
					?
					<span id="email-tooltip" class="tooltiptext">${this.language.register.flow1Errors[2]}</span>
				  </div> 
					<h2>${this.language.register.email[0]}</h2>
					<input type="email" class="data retroShade" name="${this.language.register.email[1]}">
				</div>
				<div class="linebtn">
					<a class="retroShade retroBtn btnColor-yellow" href="/login" data-link>${this.language.register.login}</a>
					<button id="flow2" class="signupBtn retroShade retroBtn btnColor-green">${this.language.register.next}</button>
				</div>
			</div>
	   </div>
        `
    }
	getThirdForm(){
		return `
		<div class="base">
			<div class="signupForm">
				<h1 id="title">${this.language.register.thirdRegister}</h1>
				<div class="line">
					<h2>${this.language.register.password[0]}</h2>
					<div class="passInput">
						<input type="password" class="data pass" name="${this.language.register.password[1]}">
						<div class="passwordSwitch">
						<img src="/imgs/openEye.png" alt="">
						</div>
					</div>
				</div>
				<div class="line">
					<h2>${this.language.register.confirmPassword[0]}</h2>
					<div class="passInput">
						<input type="password" class="data pass" name="${this.language.register.confirmPassword[1]}">
						<div class="confirmPasswordSwitch">
							<img src="/imgs/openEye.png" alt="">
						</div>
					</div>
				</div>
				<div class="errors retroShade">
					<ul>
						<li>${this.language.register.errors[0]}</li>
						<li>${this.language.register.errors[1]}</li>
						<li>${this.language.register.errors[2]}</li>
						<li>${this.language.register.errors[3]}</li>
					</ul>
				</div>
				<div class="linebtn">
					<a class="retroShade retroBtn btnColor-yellow" href="/login" data-link>${this.language.register.login}</a>
					<button id="goFlow2" class="signupBtn retroShade retroBtn btnColor-green">${this.language.register.goBack}</button>
					<button id="submit" class="signupBtn retroShade retroBtn btnColor-green">${this.language.register.submit}</button>
				</div>
			</div>
	   </div>
        `
	}
	getSecondForm(){
		return `
		<div class="base">
			<div class="signupForm">
				<h1 id="title">${this.language.register.secondRegister}</h1>
				<div class="line">
					<h2>${this.language.register.birthDate[0]}</h2>
					<input type="date" class="data" name="${this.language.register.birthDate[1]}">
				</div>
				<div class="line">
					<h2>${this.language.register.profilePicture[0]}</h2>
					<input type="file" class="data fileSelector" name="${this.language.register.profilePicture[1]}">
				</div>
				<div class="linebtn">
					<a class="retroShade retroBtn btnColor-yellow" href="/login" data-link>${this.language.register.login}</a>
					<button id="goFlow1" class="signupBtn retroShade retroBtn btnColor-green">${this.language.register.goBack}</button>
					<button id="flow3" class="signupBtn retroShade retroBtn btnColor-green">${this.language.register.next}</button>
				</div>
			</div>
		</div>
		`
	}
	setup(){
		document.addEventListener("click", (e)=>{
			//go Next
			if (e.target.id == "flow2")
			{
				this.updateField(this.getInput());
				check.flow1Check(this.field, this.errors, document.querySelectorAll(".data")).then((res)=>{
					if (res)
						document.querySelector("#app").innerHTML = this.getSecondForm();
				})
			}
			else if (e.target.id == "flow3")
			{
				this.updateField(this.getInput());
				if (check.flow2Check(this.field, this.errors, document.querySelectorAll(".data")))
				{
					document.querySelector("#app").innerHTML = this.getThirdForm();
					check.setupSwitchListener();
				}
			}
			else if (e.target.id == "submit")
			{
				this.updateField(this.getInput());
				if (check.flow3Check(this.field, this.errors, document.querySelectorAll(".data")))
				{
					delete this.field.confirmPassword;
					this.field.password = sha256(this.field.password);
					console.log(this.field)
					register(this.field)
				}
			}

			//go Back
			else if (e.target.id == "goFlow2")
			{
				document.querySelector("#app").innerHTML = this.getSecondForm();
			}
			else if (e.target.id == "goFlow1")
			{
				document.querySelector("#app").innerHTML = this.getHtml();
				this.field = {};
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