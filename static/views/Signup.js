import Aview from "/views/abstractView.js";
import register from"/API/register.js"
import * as check from "/scripts/register.js"

export default class extends Aview{
    constructor(){
		super();
		this.needListener	= true;
		this.listenerId		= "signupBtn";
		this.errors			= {
			firstName: false,
			lastName:  false,
			username: false,
			email: false,
			password: false,
			confirmPassword: false,
			birthDate: false,
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
					<h2>${this.language.register.firstName[0]}</h2>
					<input type="text" value="${this.field[this.language.register.firstName[1]]}" class="data retroShade" name="${this.language.register.firstName[1]}">
				</div>
				<div class="line">
					<h2>${this.language.register.lastName[0]}</h2>
					<input type="text" value="${this.field[this.language.register.lastName[1]]}" class="data retroShade" name="${this.language.register.lastName[1]}">
				</div>
				<div class="line">
					<h2>${this.language.register.username[0]}</h2>
					<input type="text" value="${this.field[this.language.register.username[1]]}" class="data retroShade" name="${this.language.register.username[1]}">
				</div>
				<div class="line">
					<h2>${this.language.register.email[0]}</h2>
					<input type="email" value="${this.field[this.language.register.email[1]]}" class="data retroShade" name="${this.language.register.email[1]}">
				</div>
				<div class="linebtn">
					<a class="retroShade retroBtn btnColor-yellow" href="/login" data-link>${this.language.register.login}</a>
					<button id="setPassword" class="signupBtn retroShade retroBtn btnColor-green">${this.language.register.next}</button>
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
					<button id="goFirst" class="signupBtn retroShade retroBtn btnColor-green">${this.language.register.goBack}</button>
					<button id="last" class="signupBtn retroShade retroBtn btnColor-green">${this.language.register.submit}</button>
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
					<h2>${this.language.register.birthDate[0]}</h2>
					<input type="date" class="data" name="${this.language.register.birthDate[1]}">
				</div>
				<div class="line">
					<h2>${this.language.register.profilePicture[0]}</h2>
					<input type="file" class="data fileSelector" name="${this.language.register.profilePicture[1]}">
				</div>
				<div class="linebtn">
					<a class="retroShade retroBtn btnColor-yellow" href="/login" data-link>${this.language.register.login}</a>
					<button id="getSecond" class="signupBtn retroShade retroBtn btnColor-green">${this.language.register.goBack}</button>
					<button id="submit" class="signupBtn retroShade retroBtn btnColor-green">${this.language.register.submit}</button>
				</div>
			</div>
		</div>
		`
	}
	setError(){
		let inputs = document.querySelectorAll(".data");

		for (let inp of inputs)
		{
			if (this.errors[inp.name] && !inp.classList.contains("pass"))
			{
				inp.parentNode.classList.add("red")
				inp.parentNode.classList.remove("green")
			}
			else if (!this.errors[inp.name] )
			{
				inp.parentNode.classList.add("green")
				inp.parentNode.classList.remove("red")
			}
			else if (this.errors[inp.name] && inp.classList.contains("pass"))
			{
				inp.parentNode.parentNode.classList.add("red")
				inp.parentNode.parentNode.classList.remove("green")
			}
			else
			{
				inp.parentNode.parentNode.classList.add("green")
				inp.parentNode.parentNode.classList.remove("red")
			}
		}
		if (document.querySelector(".errors") != null && (this.errors.password || this.errors.confirmPassword))
			document.querySelector(".errors").style.display = "flex";
	}
	setup(){
		document.addEventListener("click", (e)=>{
			if (e.target.id == "setPassword")
			{
				this.updateField(this.getInput());
				if (!check.firstCheck(this.field, this.errors)){
					document.querySelector("#app").innerHTML = this.getSecondForm();
					check.setupSwitchListener();
				}
				else
					this.setError();
			}
			else if (e.target.id == "last")
			{
				this.updateField(this.getInput());
				if (!check.checkPassword(this.field, this.errors))
					document.querySelector("#app").innerHTML = this.getThirdForm();
				else
					this.setError();
			}
			else if (e.target.id == "getSecond")
				document.querySelector("#app").innerHTML = this.getSecondForm();
			else if (e.target.id == "goFirst")
			{
				document.querySelector("#app").innerHTML = this.getHtml();
				this.field = {};
			}
			else if (e.target.id == "submit")
			{
				this.updateField(this.getInput());
				if (!check.lastCheck(this.field, this.errors))
					register(this.field)
				else				
					this.setError();
				console.log(this.field)
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