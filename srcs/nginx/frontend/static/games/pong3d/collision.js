import * as THREE from 'three';

function topWin(game){
    document.querySelector(".p2Display").innerHTML = `<h1>Score: ${++game.p2Score}<h1>`;
    game.ball.obj.position.set(0, 10, 0);
    game.deltaX = 0;
    game.deltaZ = 0;
    game.deltaZControlBot = true
    game.deltaZControlTop = true

}
function botWin(game){
    document.querySelector(".p1Display").innerHTML = `<h1>Score: ${++game.p1Score}<h1>`;
    game.ball.obj.position.set(0, 10, 0);
    game.deltaX = 0;
    game.deltaZ = 0;
    game.deltaZControlBot = true;
    game.deltaZControlTop = true;
}

export default function checkCollision(game){
    const topPadleColl = new THREE.Box3().setFromObject(game.topPadle.obj);
    const botPadleColl = new THREE.Box3().setFromObject(game.padle.obj);
    const lWall = new THREE.Box3().setFromObject(game.leftWall.obj);
    const rWall = new THREE.Box3().setFromObject(game.rightWall.obj);
    const tWall = new THREE.Box3().setFromObject(game.topWall.obj);
    const bWall = new THREE.Box3().setFromObject(game.botWall.obj);
    const ballColl = new THREE.Box3().setFromObject(game.ball.obj);
    
    if (ballColl.intersectsBox(bWall))
        topWin(game);
    if (ballColl.intersectsBox(tWall))
        botWin(game);
    if (ballColl.intersectsBox(topPadleColl) && game.deltaZControlTop)
    {
        game.deltaZ = -game.deltaZ;
        game.deltaZControlTop = false;
        game.deltaZControlBot = true;
    }
    if (ballColl.intersectsBox(botPadleColl) && game.deltaZControlBot)
    {
        game.deltaZ = -game.deltaZ;
        game.deltaZControlBot = false;
        game.deltaZControlTop = true
    }
    if (ballColl.intersectsBox(lWall) || ballColl.intersectsBox(rWall) )
        game.deltaX = -game.deltaX;
    game.padle.obj.position.x = game.botPadleX;
    game.topPadle.obj.position.x = game.topPadleX;
}