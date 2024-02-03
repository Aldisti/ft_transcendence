import Aview from "/views/abstractView.js";

function getGameModeIconHtml(game)
{
    if (game.multiplayer)
        return `<img class="gameMode" src="/imgs/multiplayer.png">`;
    return `<img class="gameMode" src="/imgs/singlePlayer.png">`
}

export default class extends Aview{
    constructor(){
        super()
        this.needListener   = false;
        this.listenerId     = "";
        this.games          = {
            pong3d:{
                name: "Pong 3D",
                url: "/games/pongThreeD",
                imgUrl: "/imgs/pong3d-thumbnail.jpg",
                category: "Arcade",
                multiplayer: true
            },
            pong:{
                name: "Pong 2D",
                url: "/games/pongTwoD",
                imgUrl: "/imgs/pong-thumbnail.png",
                category: "Arcade",
                multiplayer: false
            }
        }
    }

    generateGamesLink(games)
    {
        let html = "";

        for (let key of Object.keys(games))
        {
            html += `<a class="link" href="${games[key].url}" data-link>
                        <div class="gameTitle">
                            <h2>${games[key].name}</h2>
                            <div class="gameModeWrap">
                                ${getGameModeIconHtml(games[key])}
                            </div>
                        </div>
                        <div class="imgWrap">
                            <img src="${games[key].imgUrl}">
                        </div>    
                        <h4><span>${this.language.game.category}</span>${games[key].category}</h4>
                    </a>`
        }
        return html;
    }

    getHtml(){  
        return `
        <div class="base">
            ${this.generateGamesLink(this.games)}
       </div>
        `
    }
    setup(){
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpeg")
    }
}