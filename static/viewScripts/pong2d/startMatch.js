import startGame from "/games/pong2d/mainLoop.js"

export default function game(){

    let gameCanvas = document.querySelector(".center").clientWidth;

    document.querySelector(".center").style.width = `${gameCanvas}px`;
    startGame({ 
        previousTime: window.performance.now(),
        canvas: document.querySelector("#myCanv"),
        width: gameCanvas,
        height: window.innerWidth > 900 ? gameCanvas / 1.77 : document.querySelector(".center").clientHeight * 60 / 100,
        frameInterval: 1000 / 60,
        ratio: 1.77,
        texture: "https://t4.ftcdn.net/jpg/03/98/58/17/360_F_398581781_slNozTpXlCevO60U2I0z8CPvf2eT9Gas.jpg",
        currentUser: window.innerWidth > 900 ? "paddleRight" : "paddleLeft",
        ballConfig: {
            texture: "/imgs/ball.png", 
            size: 20
        },
        padleRightConfig: {
            width: 20,
            height: 100,
            texture: "/imgs/pill.png",
            x: 0,
            y: 0,
        },
        padleLeftConfig: {
            width: 20,
            height: 100,
            texture: "/imgs/pill.png",
            x: 0,
            y: 0,
        }
    });
}