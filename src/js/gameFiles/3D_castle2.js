class CastleType2{

    constructor() {
        
        this.object = new THREE.Object3D();
        this.castletype2 = castleType2.scene;
        this.object.add(this.castletype2);
        this.object.position.set(300,2.5,150);
        this.object.rotation.set(0,3.14159,0);
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