export default class{
    constructor(canvas, paddleConfig){
        this.width = paddleConfig.width;
        this.height = paddleConfig.height;
        this.canvas = canvas,
        this.ctx = canvas.getContext("2d")
        this.deltaY = 1.6;
        this.x = paddleConfig.x;
        this.y = paddleConfig.y;
        this.padding = paddleConfig.padding
        this.upInterval;
        this.downInterval;
        this.texture = paddleConfig.texture == undefined ? "" : paddleConfig.texture;
        this.img = new Image();
        this.img.src = this.texture;
    }

    updatePosition(x, y){
        this.x = x;
        this.y = y;
    }

    calculatePosition(direction){
        if (direction == true && this.y + this.height + this.deltaY <= this.canvas.height)
            this.y += this.deltaY;
        else if (direction == false && this.y - this.deltaY > 0)
            this.y -= this.deltaY;        
    }

    drawCircle(x, y){
        this.ctx.beginPath();
        this.ctx.arc(x , y, this.width / 2, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = '#ffffff'; // You can set your preferred color
        this.ctx.fill();
        this.ctx.closePath();
    }

    draw(){
        this.ctx.fillStyle = "#ffffff";
		this.ctx.fillRect(this.x, this.y + 10, this.width, this.height -20);
        this.drawCircle(this.x + (this.width / 2), this.y + 10)
        this.drawCircle(this.x + this.width / 2, this.y + this.height - 10)
        if (this.texture != "")
            this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}