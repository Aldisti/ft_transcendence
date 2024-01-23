export default class{
    constructor(canvas, paddleConfig){
        this.width = paddleConfig.width;
        this.height = paddleConfig.height;
        this.canvas = canvas,
        this.ctx = canvas.getContext("2d")
        this.x = paddleConfig.x;
        this.y = paddleConfig.y;
        this.padding = paddleConfig.padding

    }

    updatePosition(x, y){
        this.x = x;
        this.y = y;
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
        let img = new Image();
        img.src = "/imgs/pill.png"
		this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.drawCircle(this.x + this.width / 2, this.y)
        this.drawCircle(this.x + this.width / 2, this.y + this.height)
        this.ctx.drawImage(img, this.x, this.y - 17, this.width, this.height + 30)
    }
}