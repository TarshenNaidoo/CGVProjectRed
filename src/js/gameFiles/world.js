//import objects in Z-Game.html where all the other imports are. Add them below the rest
//call a function in gameStartScript.js and pass imported object to that function
//assign the imported objects .scene attribute to a an object declared above those functions
//add that object to this.world below


class World {

    constructor() {

        this.world = new THREE.Object3D;
        this.world.add(world);

        //To add objects in gameStartScript to the world, add them like
        //this.world.add(<object in gameStartScript>);
    }

    getWorld(){
        return this.world;
    }

}