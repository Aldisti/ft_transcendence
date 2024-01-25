export default class {
    constructor(canvas, ballConfig){
        this.texture = ballConfig.texture == undefined ? "" : ballConfig.texture;
        this.canvas = canvas;
        this.color = ballConfig.color == undefined ? "black" : ballConfig.color;
        this.objOffSet = this.canvas.getBoundingClientRect();
        this.centerX = (canvas.width / 2);
        this.centerY = (canvas.height / 2);
        this.ballSize = ballConfig.size == undefined ? 20 : ballConfig.size;
		this.ballOffSet = (this.ballSize / 2);
        this.x = 0;
		this.y = 0;
        this.deltaX = 2.5;
		this.deltaY = 2.5;
        this.ctx = canvas.getContext("2d");
        this.needToCalculate = true;
        this.image =  new Image()
        this.image.src = this.texture;
        this.fps = 60;
    }

    drawCircle(x, y){
        this.ctx.beginPath();
        this.ctx.arc(x , y, this.ballSize / 2, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color; // You can set your preferred color
        this.ctx.fill()
        this.ctx.closePath();
    }

    calculatePosition(){
        if (this.x < 0 || this.x >= this.canvas.width - this.ballSize)
            this.deltaX *= -1;
        if (this.y < 0 || this.y >= this.canvas.height - this.ballSize)
            this.deltaY *= -1;

        this.x += this.deltaX;
        this.y += this.deltaY;
    }

    updatePosition(x, y, deltaX, deltaY){
        this.x = x;
        this.y = y;
        this.deltaX = (deltaX * 60) / this.fps;
        this.deltaY = (deltaY * 60) / this.fps;
        // console.log(deltaX, deltaY, this.deltaX, this.deltaY)
    }

    draw(){
        this.drawCircle(this.x + this.ballOffSet, this.y + this.ballOffSet);
        if (this.texture != "")
            this.ctx.drawImage(this.image, this.x, this.y , this.ballSize, this.ballSize)
    }
}