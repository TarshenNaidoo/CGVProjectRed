class TreeType3{

    constructor(i, scene) {
        this.scene = scene;
        this.object = new THREE.Object3D();
        this.tree = treeType3Array_3D[i].scene;
        this.object.add(this.tree)
        this.object.position.set((Math.random())*2*250,4, (Math.random())*2*250);
        this.force = 1;
		this.range = 3;
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