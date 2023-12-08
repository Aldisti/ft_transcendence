import StartingObjectPosition from "/games/pong3d/startingPos.js"
import * as THREE from 'three';
import Obj from "/games/pong3d/modelsHelper.js"

//defining Canvas size
let leftCanvas  = document.querySelector("#botView")
let rightCanvas = document.querySelector("#topView")

leftCanvas.width = window.innerWidth / 2.3;
leftCanvas.heigth = window.innerHeight / 2.3;
rightCanvas.width = window.innerWidth / 2.3;
rightCanvas.heigth = window.innerHeight / 2.3;

//initializing 3D models
let     gamePos = new StartingObjectPosition();
export default class Game{
    constructor(){
        this.scene = new THREE.Scene();
        this.deltaZControlTop = true;
        this.deltaZControlBot = true;
        this.deltaX = 0;
        this.deltaZ = 0;
        this.botPadleX = 0;
        this.topPadleX = 0;
        this.p1Score = 0;
        this.p2Score = 0;
        
        //models
        this.padle = new Obj(leftCanvas, "/models/pong.gltf", gamePos.botPadlerotation, gamePos.botPadleScale, gamePos.botPadlePosition, this.scene);
        this.topPadle = new Obj(leftCanvas, "/models/pong.gltf", gamePos.topPadlerotation, gamePos.topPadleScale, gamePos.topPadlePosition, this.scene);
        this.ground = new Obj(leftCanvas, "/models/ground.gltf", gamePos.groundrotation, gamePos.groundScale, gamePos.groundPosition, this.scene);
        this.leftWall = new Obj(leftCanvas, "/models/wall.gltf", gamePos.leftWallrotation, gamePos.leftWallScale, gamePos.leftWallPosition, this.scene);
        this.rightWall = new Obj(leftCanvas, "/models/wall.gltf", gamePos.rightWallrotation, gamePos.rightWallScale, gamePos.rightWallPosition, this.scene);
        this.ball = new Obj(leftCanvas, "/models/ball.gltf", gamePos.ballRotation, gamePos.ballScale, gamePos.ballPosition, this.scene);
        this.botWall = new Obj(leftCanvas, "/models/wall.gltf", gamePos.botWallrotation, gamePos.botWallScale, gamePos.botWallPosition, this.scene);
        this.topWall = new Obj(leftCanvas, "/models/wall.gltf", gamePos.topWallrotation, gamePos.topWallScale, gamePos.topWallPosition, this.scene);

        //camera
        this.topRenderer = new THREE.WebGLRenderer({canvas: topView});
        this.topCamera = new THREE.PerspectiveCamera( 75, rightCanvas.width/rightCanvas.heigth, 0.1, 1000 );
        this.botRenderer = new THREE.WebGLRenderer({canvas: botView});
        this.botCamera = new THREE.PerspectiveCamera( 75, leftCanvas.width/leftCanvas.heigth, 0.1, 1000 );
        
        this.topRenderer.setSize( rightCanvas.width, rightCanvas.heigth);
        this.topCamera.position.set( 0, 150, -260 );
        this.topCamera.rotation.set( Math.PI, 0, 0 );  
        this.botRenderer.setSize( leftCanvas.width, leftCanvas.heigth);
        this.botCamera.position.set( 0, 150, 260 );
        this.botCamera.rotation.set( 0, 0, 0 );  

        //lights
        const light1 = new THREE.PointLight(0xFFFFFF, 400000);
        light1.position.set(0, 100, 200);
        this.scene.add(light1);
        const light2 = new THREE.PointLight(0xFFFFFF, 400000);
        light2.position.set(0, 100, -200);
        this.scene.add(light2);

        //background
        const background = new THREE.TextureLoader().load('https://fs-prod-cdn.nintendo-europe.com/media/images/06_screenshots/games_5/nintendo_switch_download_software_2/nswitchds_olympictabletennis/NSwitchDS_OlympicTableTennis_01.jpg');
        this.scene.background = background;
    }
    updateBallPos(){
        this.ball.obj.position.x += this.deltaX;
        this.ball.obj.position.z += this.deltaZ;
    }
}