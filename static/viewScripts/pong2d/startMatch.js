import startGame from "/games/pong2d/mainLoop.js"

export default function game(ballTexture, groundTexture, pillTexture){

    let gameCanvas = document.querySelector(".center").clientWidth;

    document.querySelector(".center").style.width = `${gameCanvas}px`;
    startGame({ 
        previousTime: window.performance.now(),
        canvas: document.querySelector("#myCanv"),
        width: gameCanvas,
        height: window.innerWidth > 900 ? gameCanvas / 1.77 : document.querySelector(".center").clientHeight * 60 / 100,
        frameInterval: 1000 / 60,
        ratio: 1.77,
        texture: groundTexture,
        currentUser: window.innerWidth > 900 ? "paddleRight" : "paddleLeft",
        ballConfig: {
            texture: ballTexture, 
            size: 20
        },
        padleRightConfig: {
            width: 20,
            height: 100,
            texture: pillTexture,
            x: 0,
            y: 0,
        },
        padleLeftConfig: {
            width: 20,
            height: 100,
            texture: pillTexture,
            x: 0,
            y: 0,
        }
    });
}