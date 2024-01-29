export default class StartingObjectPosition{
    constructor(){        
        //BOT padle
        this.botPadlerotation = {x: Math.PI/2, y: 0, z: Math.PI}
        this.botPadleScale = {x: 3, y: 3, z: 3}
        this.botPadlePosition = {x: 1, y: 20, z: 200}
        //TOP padle
        this.topPadlerotation = {x: Math.PI/2, y: 0, z: 2 * Math.PI}
        this.topPadleScale = {x: 3, y: 3, z: 3}
        this.topPadlePosition = {x: 1, y: 20, z: -200}
        //ground
        this.groundrotation = {x: 0, y: Math.PI/2, z: 0}
        this.groundScale = {x: 12, y: 1, z: 15}
        this.groundPosition = {x: 10, y: 0, z: 0};
        //LEFT wall
        this.leftWallrotation = {x: 0, y: Math.PI/2, z: 0}
        this.leftWallScale = {x: 12, y: 8, z: 4}
        this.leftWallPosition = {x: 125, y: 0, z: 0}
        //right wall
        this.rightWallrotation = {x: 0, y: Math.PI/2, z: 0}
        this.rightWallScale = {x: 12, y: 8, z: 4}
        this.rightWallPosition = {x: -178, y: 0, z: 0}
        //BOT wall
        this.botWallrotation = {x: 0, y: 0, z: 0}
        this.botWallScale = {x: 20, y: 26, z: 20}
        this.botWallPosition = {x: 0, y: -40, z: 150}
        //TOP wall
        this.topWallrotation = {x: 0, y: 0, z: 0}
        this.topWallScale = {x: 20, y: 26, z: 20}
        this.topWallPosition = {x: 0, y: -40, z: -380}
        //ball
        this.ballRotation = {x: 0, y: 0, z: 0}
        this.ballScale = {x: 1, y: 1, z: 1}
        this.ballPosition = {x: 0, y: 10, z: 0}
    }
}