import startGame from "/games/pong2d/mainLoop.js"

export default function game(ballTexture, groundTexture, pillTexture, gameConfig){

    let gameCanvas = document.querySelector(".gameContainer").clientWidth;
    console.log(gameCanvas)

    startGame({ 
        previousTime: window.performance.now(),
        canvas: document.querySelector("#myCanv"),
        width: gameCanvas,
        height: gameCanvas / 1.77,
        frameInterval: 1000 / 60,
        ratio: 1.77,
        texture: groundTexture,
        currentUser: gameConfig.user1 == localStorage.getItem("username") ? "paddleLeft" : "paddleRight",
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