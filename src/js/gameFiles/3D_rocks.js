class Rocks{

    constructor(i, scene) {
        this.scene = scene;
        this.object = new THREE.Object3D();
        this.rock = rockArray_3D[i].scene;
        this.object.add(this.rock)
        this.object.position.set((Math.random())*2*250,1, (Math.random())*2*250);
        this.object.scale.set(0.5,0.5,0.5);
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