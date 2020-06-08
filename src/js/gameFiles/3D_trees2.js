class TreeType2{

    constructor(i, scene) {
        this.scene = scene;
        this.object = new THREE.Object3D();
        this.tree = treeType2Array_3D[i].scene;
        this.object.add(this.tree)
        this.object.position.set((Math.random())*5*250,4.25, (Math.random())*5*250);
        this.object.scale.set(3,3,3);
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