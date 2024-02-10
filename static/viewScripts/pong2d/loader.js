import Ball from "/games/pong2d/Ball.js"
import Paddle from "/games/pong2d/Paddle.js"

export default function startAnimation(){
    let ball = new Ball(document.querySelector("#waitCanv"), {size:22});
    ball.deltaX = 8;
    ball.deltaY = 5;
    let left = new Paddle(document.querySelector("#waitCanv"), {
        width: 25,
        height: 170,
        x: 1,
        y: 0,
    });
    let right = new Paddle(document.querySelector("#waitCanv"), {
        width: 25,
        height: 170,
        x: 0,
        y: 0,
    });

    function animate()
    {
        if (localStorage.getItem("gameStarted") == "true" || document.querySelector("#waitCanv") == null){
            localStorage.removeItem("gameStarted");
            return ;
        }
        ball.calculatePosition();
        right.y = ball.y - 35
        right.x = document.querySelector("#waitCanv").width - 11;
        left.y = ball.y - 35
        ball.ctx.fillStyle = "white";
        ball.ctx.fillRect(0, 0, document.querySelector("#waitCanv").width, document.querySelector("#waitCanv").height);
        ball.draw();
        left.draw();
        right.draw();
        requestAnimationFrame(animate);
    }

    animate()
}