export default class User{
    constructor(name, displayName){
        this.name = name;
        this.loggedUser = localStorage.getItem("username");
        this.position;
        this.opponentPosition;
        this.score = 0;
        this.opponentScore = 0;
        this.scoreDisplay;
        this.sound;
        this.displayName = displayName ?? undefined;
    }

    updateScore(scores){
        if (scores[this.position] != this.score){
            this.score = scores[this.position];
            this.scoreDisplay.innerHTML = this.score;
            if (this.loggedUser == this.name){
                document.querySelector(".gameStart").style.display = "none"
                document.querySelector(".gameWait").style.display = "flex"
                this.sound = window.playFile("/sound/win.wav")
            }
        }
        if (scores[this.opponentPosition] != this.opponentScore){
            this.opponentScore = scores[this.opponentPosition];
            if (this.loggedUser == this.name){
                document.querySelector(".gameStart").style.display = "flex"
                document.querySelector(".gameWait").style.display = "none"
                this.sound = window.playFile("/sound/gameOver.wav")
            }
        }
    }

    initMobile(pos){
        if (pos == "right"){
            this.position = "right"
            this.opponentPosition = "left"
            this.needToStart = true;
            this.scoreDisplay = document.querySelector("#currentUserDisplayMobile h2")

            document.querySelector("#currentUserDisplayMobile h4").innerHTML = this.displayName == undefined ? this.name : this.displayName;
        }
        else{
            this.position = "left"
            this.opponentPosition = "right"
            this.needToStart = false;
            this.scoreDisplay = document.querySelector("#opponentDisplayMobile h2");

            document.querySelector("#opponentDisplayMobile h4").innerHTML = this.displayName == undefined ? this.name : this.displayName;
        }
        if (this.position == "right" && this.loggedUser == this.name){
            document.querySelector(".gameStart").style.display = "flex"
            document.querySelector(".gameWait").style.display = "none"
        }
    }

    initDesktop(pos){
        if (pos == "right"){
            this.position = "right"
            this.opponentPosition = "left"
            this.scoreDisplay = document.querySelector("#currentUserDisplay h2")

            document.querySelector(".user2").innerHTML = this.displayName == undefined ? this.name : this.displayName;
        }
        else{
            this.position = "left"
            this.opponentPosition = "right"
            this.scoreDisplay = document.querySelector("#opponentDisplay h2");

            document.querySelector(".user1").innerHTML = this.displayName == undefined ? this.name : this.displayName;
       }
        if (this.position == "right" && this.loggedUser == this.name){
            document.querySelector(".gameStart").style.display = "flex"
            document.querySelector(".gameWait").style.display = "none"
        }
    }

    initPlayer(pos){
        if (window.innerWidth < 900)
            this.initMobile(pos);
        else
            this.initDesktop(pos);

    }

}