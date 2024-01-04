let language = {
	en: {
		login: {
			login: "Login",
			name:	"Username: ",
			password: "Password: ",
			submit: "Submit!",
			register: "Register!",
			intraLogin: "Login with 42",
		},
		register: {
			register: "Register [1/3]",
			secondRegister: "Register [2/3]",
			thirdRegister: "Register [3/3]",
			//when translating better do it only on the first element
			firstName:	["First Name:", "first_name"],
			lastName:	["Last Name:", "last_name"],
			birthDate: ["Birth Date:", "birthdate"],
			username: ["Username:", "username"],
			profilePicture: ["Picture:", "picture"],
			email: ["Email:", "email"],
			password: ["Password:", "password"],
			confirmPassword: ["Confirm password:", "confirmPassword"],
			//until here
			flow1Errors: ["Cannot be Blank", "already in use", "Come back when you are in trouble", "this is not a valid email...", "bad character inserted. Allowed ones are: A-Za-z0-9!?*@$~_-", "allowed character are: A-Za-z0-9 -"],
			flow2Errors: ["is the minimum age to be registered on our website", "Come back when you are in trouble"],
			errors: ["Password must be at leat 8 character long", "Password must contain at least one special caracter", "Password must contain at least one number", "Password must contain at least one uppercase letter", "Password must contain at least one lower case letter"],
			next: "Next!",
			goBack: "Go Back",
			submit: "Submit!",
			login: "LogIn!"
		},
		home: {
			firstTitle: "Our Game",
			firstText: "Welcome to our game development studio, where every pixel, every line of code, and every design choice is crafted with meticulous care and passion.At our studio, we believe that creating extraordinary games requires an unwavering dedication to detail and a deep understanding of player experiences. Our team comprises visionary designers, talented programmers, and creative artists who collaborate seamlessly to bring captivating worlds to life.",
			secondTitle: "The Process",
			secondText: "From the inception of an idea to the final product, our games undergo a journey marked by precision and innovation. We delve into the core of storytelling, gameplay mechanics, and visual aesthetics to ensure that each aspect harmoniously complements the others, delivering an immersive and unforgettable gaming experience. We meticulously design and iterate, pouring our creativity into every aspect of the game. Each element undergoes rigorous testing and refinement, guaranteeing a seamless and enjoyable experience for our players.",
		},
		update: {
			emailTitle: "change Email",
			generalTitle: "change General Info",
			passwordTitle: "change Password",
			pictureTitle: "change Profile Picture",
			logout: "Logout",
			confirmLogout: "are you sure that you want to perform logout?",
			logoutError: "something went wrong try again...",
			
			firstName:	["First Name:", "first_name"],
			lastName:	["Last Name:", "last_name"],
			birthDate: ["Birth Date:", "birthdate"],
			username: ["Username:", "username"],
			profilePicture: ["Profile Picture:", "picture"],
			email: ["Email:", "email"],
			passwordErrors: ["password not correct"],
			password: ["Password:", "password"],
			oldPassword: ["Old Password:", "oldPassword"],
			newPassword: ["New Password:", "newPassword"],
			confirmNewPassword: ["Confirm password:", "confirmNewPassword"],
		}
	},
	ita: {
		login: {
			login: "Login",
			name:	"Username: ",
			password: "Password: ",
			submit: "Submit!",
			register: "Register!"
		},
		register: {
			register: "Registrazione [1/3]",
			secondRegister: "Register [2/3]",
			thirdRegister: "Register [3/3]",
			firstName:	["First Name:", "firstName"],
			lastName:	["Last Name:", "lastName"],
			birthDate: ["Birth Date:", "birthDate"],
			username: ["Username:", "username"],
			profilePicture: ["Profile Picture:", "profilePicture"],
			email: ["Email:", "email"],
			password: ["Password:", "password"],
			confirmPassword: ["Confirm password:", "confirmPassword"],
			flow1Errors: ["Cannot be Blank", "already in use", "Come back when you are in trouble", "this is not a valid email..."],
			errors: ["Password must be at leat 8 character long", "Password must contain at least one special caracter", "Password must contain at least one number", "Password must contain at least one uppercase letter"],
			next: "Next!",
			goBack: "Go Back",
			submit: "Submit!",
			login: "LogIn!"
		},
		home: {
			firstTitle: "Our Game",
			firstText: "Welcome to our game development studio, where every pixel, every line of code, and every design choice is crafted with meticulous care and passion.At our studio, we believe that creating extraordinary games requires an unwavering dedication to detail and a deep understanding of player experiences. Our team comprises visionary designers, talented programmers, and creative artists who collaborate seamlessly to bring captivating worlds to life.",
			secondTitle: "The Process",
			secondText: "From the inception of an idea to the final product, our games undergo a journey marked by precision and innovation. We delve into the core of storytelling, gameplay mechanics, and visual aesthetics to ensure that each aspect harmoniously complements the others, delivering an immersive and unforgettable gaming experience. We meticulously design and iterate, pouring our creativity into every aspect of the game. Each element undergoes rigorous testing and refinement, guaranteeing a seamless and enjoyable experience for our players.",
		}
	},
}

export default language