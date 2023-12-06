import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


class Obj{
    constructor(canv, path, rot)
    {
        this.scene;
        this.camera;
        this.renderer;
        this.controls;
        this.obj;
        this.canv = canv;
        this.path = path;

        //defining base object for 3d model
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, canv.clientWidth/canv.clientHeight, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer({canvas: canv});

        //defining background color
        this.scene.background = new THREE.Color(0x000000);

        //setting up controls and window size
        this.renderer.setSize( canv.clientWidth, canv.clientWidth);
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.camera.position.set( 0, 0, 170 );
        this.controls.update();
        
        //adding lights
        const light1 = new THREE.PointLight(0xFFFFFF, 100000);
        light1.position.set(100, 100, 100);
        this.scene.add(light1);
        const light2 = new THREE.PointLight(0xFFFFFF, 100000);
        light2.position.set(-100, 100, -100);
        this.scene.add(light2);
        
        //import model
        let loader = new GLTFLoader();
        let self = this;
        loader.load( path, function ( gltf ) {
            self.obj = gltf.scene;
            self.obj.scale.set(5, 5, 5)
            self.obj.position.set(0, 0, 0)
            self.obj.rotation.set(rot.x, rot.y, rot.z)
            self.scene.add( self.obj );
        
        }, undefined, function ( error ) {
        
            console.error( error );
        
        } );
    }
}

export default function startAnimation (){
    let padleCanv  = document.querySelector("#padle")
    let groundCanv  = document.querySelector("#ground")
    // let wallCanv  = document.querySelector("#wall")

    let padle = new Obj(padleCanv, "/models/pong.gltf", {x: Math.PI/2, y: -Math.PI/4, z: 0});
    let ground = new Obj(groundCanv, "/models/ground.gltf", {x: Math.PI/4, y: 0, z: 0});
    // let wall = new Obj(wallCanv, "/wall.gltf", {x: 0, y: 0, z: 0});
    
    let previousTime = 0;
    const targetFrameRate = 30; // Target frame rate (in FPS)
    const frameInterval = 1000 / targetFrameRate; // Interval in milliseconds between frames
    function animate(currentTime) {
        const deltaTime = currentTime - previousTime;

        if (padle.obj != undefined)
            padle.obj.rotation.z += 0.01;
        if (ground.obj != undefined)
            ground.obj.rotation.y += 0.01;
        // if (wall.obj != server.js.jsed)
        //     wall.obj.rotation.y += 0.005;
        padle.controls.update();
        ground.controls.update();
        if (deltaTime > frameInterval) {
            previousTime = currentTime - (deltaTime % frameInterval);
    
            padle.renderer.render( padle.scene, padle.camera );
            ground.renderer.render( ground.scene, ground.camera );
            // wall.renderer.render( wall.scene, wall.camera );wall
        }

        requestAnimationFrame( animate );
    }
    animate();
}