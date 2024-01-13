let language = {
	en: {
		navbar: {
			login: "Login",
			register: "Register",
			home: "Home",
			games: "Games",
			changeLanguage: "Change Language",
			changeStyle: "Change Style",
			accountMenu: "Account"
		},
		login: {
			login: "Login",
			name:	"Username: ",
			password: "Password: ",
			submit: "Submit!",
			register: "Not yet registered?",
			intraLogin: "Login",
			googleLogin: "Login", 
			error: "Check Provided Info"
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
			firstTitle: "Our Games",
			firstText: "Welcome to our game development studio, where every pixel, every line of code, and every design choice is crafted with meticulous care and passion.At our studio, we believe that creating extraordinary games requires an unwavering dedication to detail and a deep understanding of player experiences. Our team comprises visionary designers, talented programmers, and creative artists who collaborate seamlessly to bring captivating worlds to life.",
			secondTitle: "The Process",
			secondText: "From the inception of an idea to the final product, our games undergo a journey marked by precision and innovation. We delve into the core of storytelling, gameplay mechanics, and visual aesthetics to ensure that each aspect harmoniously complements the others, delivering an immersive and unforgettable gaming experience. We meticulously design and iterate, pouring our creativity into every aspect of the game. Each element undergoes rigorous testing and refinement, guaranteeing a seamless and enjoyable experience for our players.",
		},
		update: {
			emailTitle: "change Email",
			generalTitle: "change General Info",
			passwordTitle: "change Password",
			pictureTitle: "change Profile Picture",
			security: "Security",
			logout: "Logout",
			linkToIntra: "Link To Intra42",
			intraLinkConfirm: "Do you really want to link your intra profile?",
			intraUnlinkConfirm: "Do you really want to Unlink your intra profile?",
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
		navbar: {
			login: "Accesso",
			register: "Registrati",
			home: "Home",
			games: "Giochi",
			changeLanguage: "Cambia Lingua",
			changeStyle: "Cambia Stile",
			accountMenu: "Account"
		},
		login: {
		  login: "Accesso",
		  name: "Nome utente: ",
		  password: "Password: ",
		  submit: "Invia!",
		  register: "Registrati!",
		  intraLogin: "Accedi con 42",
		},
		register: {
		  register: "Registra [1/3]",
		  secondRegister: "Registra [2/3]",
		  thirdRegister: "Registra [3/3]",
		  firstName: ["Nome:", "first_name"],
		  lastName: ["Cognome:", "last_name"],
		  birthDate: ["Data di nascita:", "birthdate"],
		  username: ["Nome utente:", "username"],
		  profilePicture: ["Immagine:", "picture"],
		  email: ["Email:", "email"],
		  password: ["Password:", "password"],
		  confirmPassword: ["Conferma password:", "confirmPassword"],
		  flow1Errors: ["Non può essere vuoto", "già in uso", "Torna quando sei in difficoltà", "questa non è una email valida...", "carattere non valido inserito. I caratteri consentiti sono: A-Za-z0-9!?*@$~_-", "i caratteri consentiti sono: A-Za-z0-9 -"],
		  flow2Errors: ["è l'età minima per essere registrato sul nostro sito web", "Torna quando sei in difficoltà"],
		  errors: ["La password deve essere lunga almeno 8 caratteri", "La password deve contenere almeno un carattere speciale", "La password deve contenere almeno un numero", "La password deve contenere almeno una lettera maiuscola", "La password deve contenere almeno una lettera minuscola"],
		  next: "Avanti!",
		  goBack: "Indietro",
		  submit: "Invia!",
		  login: "Accedi!"
		},
		home: {
		  firstTitle: "I nostri giochi",
		  firstText: "Benvenuti nel nostro studio di sviluppo di giochi, dove ogni pixel, ogni riga di codice e ogni scelta di design è realizzata con cura meticolosa e passione. Nel nostro studio, crediamo che creare giochi straordinari richieda un'impegno costante nei dettagli e una profonda comprensione delle esperienze dei giocatori. Il nostro team è composto da designer visionari, programmatori talentuosi e artisti creativi che collaborano senza soluzione di continuità per dare vita a mondi accattivanti.",
		  secondTitle: "Il processo",
		  secondText: "Dall'idea al prodotto finale, i nostri giochi seguono un percorso contraddistinto da precisione e innovazione. Approfondiamo la narrativa, le meccaniche di gioco e l'estetica visiva per garantire che ogni aspetto si complementi armoniosamente con gli altri, offrendo un'esperienza di gioco coinvolgente e indimenticabile. Progettiamo e iteriamo meticolosamente, riversando la nostra creatività in ogni aspetto del gioco. Ogni elemento viene sottoposto a rigorosi test e perfezionamenti, garantendo un'esperienza fluida e piacevole per i nostri giocatori."
		},
		update: {
		  emailTitle: "Cambia Email",
		  generalTitle: "Cambia informazioni generali",
		  passwordTitle: "Cambia Password",
		  pictureTitle: "Cambia immagine del profilo",
		  logout: "Logout",
		  confirmLogout: "Sei sicuro di voler eseguire il logout?",
		  logoutError: "Qualcosa è andato storto, riprova...",
		  firstName: ["Nome:", "first_name"],
		  lastName: ["Cognome:", "last_name"],
		  birthDate: ["Data di nascita:", "birthdate"],
		  username: ["Nome utente:", "username"],
		  profilePicture: ["Immagine profilo:", "picture"],
		  email: ["Email:", "email"],
		  passwordErrors: ["password non corretta"],
		  password: ["Password:", "password"],
		  oldPassword: ["Vecchia password:", "oldPassword"],
		  newPassword: ["Nuova password:", "newPassword"],
		  confirmNewPassword: ["Conferma password:", "confirmNewPassword"]
		}
	  }	  
}

export default language