export default class {
    constructor(canvas, ballConfig){
        this.texture = ballConfig.texture == undefined ? "" : ballConfig.texture;
        this.canvas = canvas;
        this.objOffSet = this.canvas.getBoundingClientRect();
        this.centerX = (canvas.width / 2);
        this.centerY = (canvas.height / 2);
        this.ballSize = ballConfig.size == undefined ? 20 : ballConfig.size;
		this.ballOffSet = (this.ballSize / 2);
        this.x = 0;
		this.y = 0;
        // this.x = this.centerX - this.ballOffSet;
		// this.y = this.centerY - this.ballOffSet;
        this.deltaX = 1;
		this.deltaY = 0;
        this.ctx = canvas.getContext("2d");
        this.needToCalculate = true;
    }

    resetPosition(){
        this.deltaX = 0;
		this.deltaY = 0;
		this.x = this.centerX - this.ballOffSet;
		this.y = this.centerY - this.ballOffSet;
    }

    drawCircle(x, y){
        this.ctx.beginPath();
        this.ctx.arc(x , y, this.ballSize / 2, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = 'blue'; // You can set your preferred color
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#000';
        this.ctx.stroke();
        this.ctx.closePath();
    }

    calculatePosition(){
        if (this.x < 0 || this.x >= this.canvas.width - this.ballSize)
            this.deltaX *= -1;
        if (this.y < 0 || this.y >= this.canvas.height - this.ballSize)
            this.deltaY *= -1;
        // if (this.needToCalculate)
        // {
            this.x += this.deltaX;
            this.y += this.deltaY;
        // }
        // this.needToCalculate = true;
    }

    updatePosition(x, y, deltaX, deltaY){
        this.x = x;
        this.y = y;
        // console.log(deltaX, deltaY)
        this.deltaX = deltaX;
        this.deltaY = deltaY;
        // this.needToCalculate = false
    }

    draw(){
        if (this.texture == "")
            this.drawCircle(this.x + this.ballOffSet, this.y + this.ballOffSet);
        else{
            let image =  new Image()
            image.src = this.texture;
            this.ctx.drawImage(image, this.x, this.y , this.ballSize, this.ballSize)
        }
    }
}