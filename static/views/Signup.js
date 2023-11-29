import Aview from "/views/abstractView.js";

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
				<h1 id="title">Register</h1>
				<div class="line">
					<h3>Username</h3>
					<input type="text" class="data" name="name">
				</div>
				<div class="line">
					<h3>email</h3>
					<input type="email" class="data" name="email">
				</div>
				<div class="line">
					<h3>Password</h3>
					<input type="password" class="data" name="password">
				</div>
				<div class="line">
					<h3>Confirm Password</h3>
					<input type="password" class="data" name="ConfirmPassword">
				</div>
				<div class="linebtn">
					<a class="btn btn-lg btn-warning" href="/login" data-link>Login</a>
					<button id="signupBtn" class="btn btn-success">Submit!</button>
				</div>
			</div>
	   </div>
        `
    }
	setBackground(){
		document.querySelector("#app").style.backgroundImage = "url('https://img.freepik.com/free-vector/green-color-pixilated-pixel-background_1017-38027.jpg?w=1800&t=st=1701291772~exp=1701292372~hmac=24176004cc7796d77459f2798eafb88e57a6d7abc8e548b40efb2bcd5df66ce0')";
		document.querySelector("#app").style.backgroundSize = "cover"
		document.querySelector("#app").style.backgroundRepeat = "repeat"
	}
}