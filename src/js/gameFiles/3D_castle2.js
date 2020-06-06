class CastleType2{

    constructor() {
        
        this.object = new THREE.Object3D();
        this.castletype2 = castleType2.scene;
        this.object.add(this.castletype2);
        this.object.position.set(100,-5,300);
        this.object.rotation.set(0,3.14159,0);
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