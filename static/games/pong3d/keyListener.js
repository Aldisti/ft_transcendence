let botPadleLInterval;
let botPadleRInterval;
let botControlLeft = false;
let botControlRight = false;

let topPadleLInterval;
let topPadleRInterval;
let topControlLeft = false;
let topControlRight = false;

//setting up listner for key event
export function keyDownListner(game){
    window.addEventListener("keydown", (e)=>{
        if (e.key == "d" && !botControlRight)
        {
            if (botControlLeft)
            {
                clearInterval(botPadleLInterval);
                botControlLeft = false;
            }
            botControlRight = true
            botPadleRInterval = setInterval(() => {
                game.botPadleX += 2;
            }, 1);
        }
        if (e.key == "a" && !botControlLeft)
        {
            if (botControlRight)
            {
                clearInterval(botPadleRInterval);
                botControlRight = false;
            }
            botControlLeft = true
            botPadleLInterval = setInterval(() => {
                game.botPadleX -= 2;
              }, 1);
        }
        if (e.key == "ArrowLeft" && !topControlRight)
        {
            if (topControlLeft)
            {
                clearInterval(topPadleLInterval);
                botControlLeft = false;
            }
            topControlRight = true
            topPadleRInterval = setInterval(() => {
                game.topPadleX += 2;
            }, 1);
        }
        if (e.key == "ArrowRight" && !topControlLeft)
        {
            if (topControlRight)
            {
                clearInterval(botPadleRInterval);
                botControlRight = false;
            }
            topControlLeft = true
            topPadleLInterval = setInterval(() => {
                game.topPadleX -= 2;
            }, 1);
        }
        if (e.key == " ")
        {
            e.preventDefault();
            game.deltaX = Math.round(Math.random() * 100) % 2 == 0 ? -0.8 : 0.8;
            game.deltaZ = Math.round(Math.random() * 100) % 2 == 0 ? -0.8 : 0.8;
        }
    })
}

//setting up listner for key event
export function keyUpListner(game){
    window.addEventListener("keyup", (e)=>{
        if (e.key == "d")
        {
            clearInterval(botPadleRInterval)
            botControlRight = false;
        }
        if (e.key == "a")
        {
            clearInterval(botPadleLInterval)
            botControlLeft = false;
        }
        if (e.key == "ArrowLeft")
        {
            clearInterval(topPadleRInterval)
            topControlRight = false;
        }
        if (e.key == "ArrowRight")
        {
            clearInterval(topPadleLInterval)
            topControlLeft = false;
        }
    })
}