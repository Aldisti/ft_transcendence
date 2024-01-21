export default class {
    constructor(canvas, ballSize){
        this.canvas = canvas;
        this.objOffSet = this.canvas.getBoundingClientRect();
        this.centerX = (canvas.width / 2);
        this.centerY = (canvas.height / 2);
        this.ballSize = ballSize == undefined ? 20 : ballSize;
		this.ballOffSet = (this.ballSize / 2);
        this.x = this.centerX - this.ballOffSet;
		this.y = this.centerY - this.ballOffSet;
        this.deltaX = 0;
		this.deltaY = 0;
        this.ctx = canvas.getContext("2d");
    }

    resetPosition(){
        this.deltaX = 0;
		this.deltaY = 0;
		this.x = this.centerX - this.ballOffSet;
		this.y = this.centerY - this.ballOffSet;
    }

    draw(x, y){
        this.ctx.fillStyle = "#000000"
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "#ffffff"
		this.ctx.fillRect(x - this.objOffSet.left - this.ballOffSet, y - this.objOffSet.top - this.ballOffSet , this.ballSize, this.ballSize);
    }
}