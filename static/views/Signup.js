import Aview from "/views/abstractView.js";

export default class extends Aview{
    constructor(){
		super();
		this.needListener	= true;
		this.listenerId		= "signupBtn";
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
					<h3>${this.language.register.firstName[0]}</h3>
					<input type="text" value="${this.field[this.language.register.firstName[1]]}" class="data retroShade" name="${this.language.register.firstName[1]}">
				</div>
				<div class="line">
					<h3>${this.language.register.lastName[0]}</h3>
					<input type="text" value="${this.field[this.language.register.lastName[1]]}" class="data retroShade" name="${this.language.register.lastName[1]}">
				</div>
				<div class="line">
					<h3>${this.language.register.username[0]}</h3>
					<input type="text" value="${this.field[this.language.register.username[1]]}" class="data retroShade" name="${this.language.register.username[1]}">
				</div>
				<div class="line">
					<h3>${this.language.register.email[0]}</h3>
					<input type="email" value="${this.field[this.language.register.email[1]]}" class="data retroShade" name="${this.language.register.email[1]}">
				</div>
				<div class="linebtn">
					<a class="retroShade retroBtn btnColor-yellow" href="/login" data-link>${this.language.register.login}</a>
					<button id="nextBtn" class="signupBtn retroShade retroBtn btnColor-green">${this.language.register.next}</button>
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
					<h3>${this.language.register.password[0]}</h3>
					<input type="password" class="data retroShade" name="${this.language.register.password[1]}">
				</div>
				<div class="line">
					<h3>${this.language.register.confirmPassword[0]}</h3>
					<input type="password" class="data retroShade" name="${this.language.register.confirmPassword[1]}">
				</div>
				<div class="line">
					<h3>${this.language.register.birthDate[0]}</h3>
					<input type="date" class="data" name="${this.language.register.birthDate[1]}">
				</div>
				<div class="line">
					<h3>${this.language.register.profilePicture[0]}</h3>
					<input type="file" class="data fileSelector" name="${this.language.register.profilePicture[1]}">
				</div>
				<div class="linebtn">
					<a class="retroShade retroBtn btnColor-yellow" href="/login" data-link>${this.language.register.login}</a>
					<button id="goBack" class="signupBtn retroShade retroBtn btnColor-green">${this.language.register.goBack}</button>
					<button id="submit" class="signupBtn retroShade retroBtn btnColor-green">${this.language.register.submit}</button>
				</div>
			</div>
	   </div>
        `
	}
	updateField(data){
		let keys = Object.keys(data);
		for (let key of keys)
			this.field[key] = data[key];
	}
	setup(){
		document.addEventListener("click", (e)=>{
			if (e.target.id == "nextBtn")
			{
				this.updateField(this.getInput());
				document.querySelector("#app").innerHTML = this.getSecondForm();
			}
			if (e.target.id == "goBack")
			{
				document.querySelector("#app").innerHTML = this.getHtml();
				this.field = {};
			}
			if (e.target.id == "submit")
			{
				this.updateField(this.getInput());
				console.log(this.field)//call API
			}
		})
		document.querySelector("#app").style.backgroundImage = "url('/imgs/backLogin.png')";
		document.querySelector("#app").style.backgroundSize = "cover"
		document.querySelector("#app").style.backgroundRepeat = "repeat"
	}
}