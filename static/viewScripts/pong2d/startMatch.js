import startGame from "/viewScripts/pong2d/game/mainLoop.js"

export default function game(ballTexture, groundTexture, pillTexture, gameConfig){

    let gameCanvas = document.querySelector(".gameContainer").clientWidth;

    let test =  startGame({ 
        previousTime: window.performance.now(),
        canvas: document.querySelector("#myCanv"),
        width: gameCanvas,
        height: gameCanvas / 1.77,
        opponentName: gameConfig.user1 == localStorage.getItem("username") ? gameConfig.user2 : gameConfig.user1,
        texture: groundTexture,
        opponentDisplayName: gameConfig.opponentDisplay ?? undefined,
        userDisplayName: gameConfig.userDisplayName ?? undefined,
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