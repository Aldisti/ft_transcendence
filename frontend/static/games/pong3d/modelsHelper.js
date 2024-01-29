import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Obj{
    constructor(canv, path, rot, scale, pos, scene)
    {
        this.scene;
        this.obj;
        this.canv = canv;
        this.path = path;

        //defining base object for 3d model
        this.scene = scene;
        
        //import model
        let loader = new GLTFLoader();
        let self = this;
        loader.load( path, function ( gltf ) {
            self.obj = gltf.scene;
            self.obj.scale.set(scale.x, scale.y, scale.z)
            self.obj.position.set(pos.x, pos.y, pos.z)
            self.obj.rotation.set(rot.x, rot.y, rot.z)
            self.scene.add( self.obj );
        }, undefined, function ( error ) {
            console.error( error );
        } );
    }
}