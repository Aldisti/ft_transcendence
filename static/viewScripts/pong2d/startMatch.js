import startGame from "/games/pong2d/mainLoop.js"

export default function game(ballTexture, groundTexture, pillTexture, gameConfig){

    let gameCanvas = document.querySelector(".gameContainer").clientWidth;

    let test =  startGame({ 
        previousTime: window.performance.now(),
        canvas: document.querySelector("#myCanv"),
        width: gameCanvas,
        height: gameCanvas / 1.77,
        frameInterval: 1000 / 60,
        ratio: 1.77,
        playersNames: {user1: gameConfig.user1, user2: gameConfig.user2},
        texture: groundTexture,
        gameTicket: gameConfig.ticket,
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
    return (test);
}