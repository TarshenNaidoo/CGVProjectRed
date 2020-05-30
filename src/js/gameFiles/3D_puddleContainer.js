class PuddleContainer{

    constructor() {
        this.object = new THREE.Object3D();
        this.container = puddleContainer.scene;
        this.object.add(this.container);
        let randomNum1 = Math.random()*5+10;
        let randomNum2 = Math.random()*5+10;
        this.object.position.set(randomNum1, 1.5 + puddleContainerScale/2, randomNum2);
    }

    getObject(){
        return this.object;
    }

    getPosition(){
        return this.object.getPosition();
    }
}