export default class User{
    constructor(name){
        this.name = name;
        this.loggedUser = localStorage.getItem("username");
        this.position;
        this.opponentPosition;
        this.score = 0;
        this.opponentScore = 0;
        this.scoreDisplay;        
    }

    updateScore(scores){
        if (scores[this.position] != this.score){
            this.score = scores[this.position];
            this.scoreDisplay.innerHTML = this.score;
            if (this.loggedUser == this.name){
                document.querySelector(".gameStart").style.display = "none"
                document.querySelector(".gameWait").style.display = "flex"
            }

        }
        if (scores[this.opponentPosition] != this.opponentScore){
            this.opponentScore = scores[this.opponentPosition];
            if (this.loggedUser == this.name){
                document.querySelector(".gameStart").style.display = "flex"
                document.querySelector(".gameWait").style.display = "none"
            }
        }
    }

    initMobile(pos){
        if (pos == "right"){
            this.position = "right"
            this.opponentPosition = "left"
            this.needToStart = true;
            this.scoreDisplay = document.querySelector("#currentUserDisplayMobile h2")

            document.querySelector("#opponentDisplayMobile h4").innerHTML = this.name;
        }
        else{
            this.position = "left"
            this.opponentPosition = "right"
            this.needToStart = false;
            this.scoreDisplay = document.querySelector("#opponentDisplayMobile h2");

            document.querySelector("#currentUserDisplayMobile h4").innerHTML = this.name;
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


            document.querySelector(".user2").innerHTML = this.name;
        }
        else{
            this.position = "left"
            this.opponentPosition = "right"
            this.scoreDisplay = document.querySelector("#opponentDisplay h2");

            document.querySelector(".user1").innerHTML = this.name;
        }
        console.log(this.name, this.loggedUser, this.position)
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