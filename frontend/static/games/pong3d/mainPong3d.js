import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Game from "/games/pong3d/Game.js"
import * as listener from "/games/pong3d/keyListener.js"
import checkCollision from "/games/pong3d/collision.js"

let game = new Game();

//variables used to define FPS
let     previousTime = 0;
const   targetFrameRate = 144; // Target frame rate (in FPS)
const   frameInterval = 1000 / targetFrameRate; // Interval in milliseconds between frames

//setting up control for 3d scene with mouse 
let topControls = new OrbitControls( game.topCamera, game.topRenderer.domElement );
let botControls = new OrbitControls( game.botCamera, game.botRenderer.domElement );

topControls.update();
botControls.update();

//main GAME LOOP
function animate(currentTime) {
   const deltaTime = currentTime - previousTime;
    if (game.padle.obj != undefined && game.topPadle.obj != undefined && game.ground.obj != undefined && game.leftWall.obj != undefined && game.rightWall.obj != undefined && game.ball.obj != undefined)
    {
        game.updateBallPos();
        checkCollision(game)
        if (deltaTime > frameInterval) {
            previousTime = currentTime - (deltaTime % frameInterval);
            game.botRenderer.render( game.scene, game.botCamera );
            game.topRenderer.render( game.scene, game.topCamera );
        }
        game.deltaX *= 1.0008;
        game.deltaZ *= 1.0008;
        requestAnimationFrame( animate );
    }
    else
    {
        setTimeout(() => {
            requestAnimationFrame( animate );
        }, 100);
    }
}

listener.keyDownListner(game);
listener.keyUpListner(game);
animate();