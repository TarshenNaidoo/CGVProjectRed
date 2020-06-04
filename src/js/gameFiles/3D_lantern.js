class Lantern{

    constructor(i, scene) {
        this.scene = scene;
        this.object = new THREE.Object3D();
        this.lantern = lanternArray_3D[i].scene;
        this.object.add(this.lantern);
        this.lanternLight = new THREE.PointLight({color:0xFDD023,intensity:1,distance:100,decay:2});
        this.object.add(this.lanternLight);
        this.object.position.set((Math.random()-0.5)*2*600,9.5, (Math.random()-0.5)*2*600);
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

    toggleLights(){
        if (this.scene.sunlight.sunCurrentHeight < 0) {
            this.lanternLight.power = 200;
        } else {
            this.lanternLight.power = 0;
        }
    }

    animate(){
        this.toggleLights()
    }
}