export default class {
    constructor(canvas, ballConfig){
        this.texture = ballConfig.texture == undefined ? "" : ballConfig.texture;
        this.canvas = canvas;
        this.objOffSet = this.canvas.getBoundingClientRect();
        this.centerX = (canvas.width / 2);
        this.centerY = (canvas.height / 2);
        this.ballSize = ballConfig.size == undefined ? 20 : ballConfig.size;
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

    updatePosition(x, y){
        this.x = x;
        this.y = y;
    }

    draw(){
        if (this.texture == "")
            this.drawCircle(this.x, this.y);
        else{
            let image =  new Image()
            image.src = this.texture;
            this.ctx.drawImage(image, this.x, this.y , this.ballSize, this.ballSize)
        }
    }
}