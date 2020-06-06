class Wall{

    constructor() {
        
        this.object = new THREE.Object3D();
        this.wall = Wall.scene;
        this.object.add(this.wall);
        this.object.position.set(-300,0,100);
        //this.object.scale.set(3,3,3);
        this.force = 1;

    }

    getObject(){
        return this.object;
    }

    getPosition(){
        return this.object.position;
    }

    setPosition(x,y,z){
        this.object.position.set(x,y,z);
    }
}