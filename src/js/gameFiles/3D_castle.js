class Castle{

    constructor() {
        
        this.object = new THREE.Object3D();
        this.castle = castle.scene;
        this.object.add(this.castle);
        this.object.position.set(10,50,-100);
        this.object.scale.set(15,15,15);
        this.force = 1;
		this.range = 10;

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