import Aview from "/views/abstractView.js";

function getGameModeIconHtml(game)
{
    if (game.multiplayer)
        return `<img class="gameMode" src="/imgs/multiplayer.png">`;
    return `<img class="gameMode" src="/imgs/singlePlayer.png">`
}

function generateGamesLink(games)
{
    let html = "";

    for (let key of Object.keys(games))
    {
        html += `<a class="link" href="${games[key].url}" data-link>
                    <div class="overlay"></div>
                    <div class="gameInfoCont">
                        ${getGameModeIconHtml(games[key])}
                        <div class="gameInfoLine">
                            <h1>
                                ${games[key].name}
                            </h1>
                            <h3>
                                Category: 
                                ${games[key].category}
                            </h3>
                        </div>
                    </div>
                    <div class="game" style="background-image: url(${games[key].imgUrl}); background-size: cover;">
                    </div>
                </a>`
    }
    return html;
}

export default class extends Aview{
    constructor(){
        super()
        this.needListener   = false;
        this.listenerId     = "";
        this.games          = {
            pong3d:{
                name: "Pong 3D",
                url: "/pong3d",
                imgUrl: "/imgs/pongImg.png",
                category: "Arcade",
                multiplayer: true
            },
            pong:{
                name: "Pong",
                url: "/pong",
                imgUrl: "/imgs/originalPong.webp",
                category: "Arcade",
                multiplayer: false
            }
        }
    }
    getHtml(){  
        return `
        <div class="base">
            ${generateGamesLink(this.games)}
       </div>
        `
    }
    setup(){
        document.querySelector("#app").style.backgroundImage = "url('/imgs/backLogin.png')";
		document.querySelector("#app").style.backgroundSize = "cover"
		document.querySelector("#app").style.backgroundRepeat = "repeat"
    }
}