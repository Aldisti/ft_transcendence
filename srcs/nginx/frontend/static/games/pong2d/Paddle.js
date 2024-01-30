const ORIGINAL_WIDTH = 800;
const ORIGINAL_HEIGHT = 451;
export default class{
    constructor(canvas, paddleConfig){
        this.width = paddleConfig.width  * canvas.width / ORIGINAL_WIDTH;
        this.height = paddleConfig.height * canvas.height / ORIGINAL_HEIGHT ;
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
        this.x = x * this.canvas.width / ORIGINAL_WIDTH;
        this.y = y * this.canvas.height / ORIGINAL_HEIGHT;
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
        this.ctx.fillStyle = '#000000'; // You can set your preferred color
        this.ctx.fill();
        this.ctx.closePath();
    }

    draw(){
        this.ctx.fillStyle = "#000000";
        let verticalOffest = 20 * this.canvas.height / ORIGINAL_HEIGHT
		this.ctx.fillRect(this.x, this.y + (verticalOffest / 2), this.width, this.height - verticalOffest);
        this.drawCircle(this.x + (this.width / 2), this.y + (verticalOffest / 2))
        this.drawCircle(this.x + this.width / 2, this.y + this.height - (verticalOffest / 2))
        if (this.texture != "")
            this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}