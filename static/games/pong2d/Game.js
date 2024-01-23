import Ball from "/games/pong2d/Ball.js"
import Paddle from "/games/pong2d/Paddle.js"


export default class {
    constructor(gameCfg){
        this.width = gameCfg.width;
        this.height = gameCfg.height;
        this.ratio = gameCfg.ratio;
        this.canvas = gameCfg.canvas;
        if (window.innerWidth >= window.innerHeight)
        {
            this.canvas.width =  gameCfg.width;
            this.canvas.height = gameCfg.width / gameCfg.ratio;
        } else{
            this.canvas.width =  gameCfg.height * ratio;
            this.canvas.height = gameCfg.height; 
        }
        this.paddleLeft = new Paddle(this.canvas, gameCfg.padleLeftConfig)
        this.paddleRight = new Paddle(this.canvas, gameCfg.padleRightConfig)
        this.ball = new Ball(this.canvas, gameCfg.ballConfig)
        this.ctx = gameCfg.canvas.getContext("2d");
    }

    draw(x, y){
        this.ctx.fillStyle = "#000000";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ball.draw(x, y);
        this.paddleLeft.draw();
        this.paddleRight.draw();
    }
}