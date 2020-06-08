//import objects in Z-Game.html where all the other imports are. Add them below the rest
//call a function in 3D_gameStartScript.js and pass imported object to that function
//assign the imported objects .scene attribute to a an object declared above those functions
//add that object to this.world below


class World {

    constructor() {

        this.world = new THREE.Object3D;
        this.world.add(world_3D);

        //To add objects in gameStartScript to the world, add them like
        //this.world.add(<object in gameStartScript>);
        
        this.treeType1Array = [];
        this.treeType2Array = [];

        this.rockArray = [];

        this.castle = new Castle(); //creates a castle object
        this.collisionObjects.push(this.castle);
        this.rayCastObjects.push(this.castle.getObject());
        this.add(this.castle.getObject());

        this.castleType2 = new CastleType2(); //creates a castle object
        this.collisionObjects.push(this.castleType2);
        this.rayCastObjects.push(this.castleType2.getObject());
        this.add(this.castleType2.getObject());

        this.castleType3 = new CastleType3(); //creates a castle object
        this.collisionObjects.push(this.castleType3);
        this.rayCastObjects.push(this.castleType3.getObject());
        this.add(this.castleType3.getObject());

        for (let i = 0 ; i < treeType1Num_3D ; i++) { //creates tree objects
            let treeType1 = new TreeType1(i, this);
            this.treeType1Array.push(treeType1);
            this.add(treeType1.getObject());
        }


        for (let i = 0 ; i < rockNum_3D ; i++) {
            let rock = new Rocks(i, this);
            this.rockArray.push(rock);
            this.add(rock.getObject());
        }
        
        for (let i = 0 ; i < treeType2Num_3D ; i++) {
            let treeType2 = new TreeType2(i, this);
            this.treeType2Array.push(treeType2);
            this.add(treeType2.getObject());
        }
        

        
    }

    getWorld(){
        return this.world;
    }

}