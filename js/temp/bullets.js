class Bullets {

    constructor(maxBullets, scene, theMaterial) {

        this.material = theMaterial;
        this.bulletWidth = 0.8;
        this.maxBullets = maxBullets;
        this.bullets = [];
        this.launched = [];
        this.target = [];
        for (var i = 0 ; i < maxBullets; i++) {
            this.launched = false;
            this.target[i] = new THREE.Vector3(0,0,0);
            this.bullets[i] = this.createObject(i);
            scene.add(this.bullets[i]);
        }
    }

    getLaunched(i) {
        return this.launched[i];
    }

    setLaunched(i){
        this.launched[i] = false;
    }

    getParameters(i) {
        let parameters = {x: this.bullets[i].position.x, y: this.bullets[i].position.y,
            z: this.bullets[i].position.z, radius: this.bulletWidth/2};
        return parameters;
    }

    reload() {
        for (let i = 0 ; i < this.maxBullets; i++) {
            this.bullets[i].remove();
            this.launched[i] = false;
            this.target[i] = new THREE.Vector3(0,0,0);
            this.bullets[i] = this.createObject(i);
            scene.add(this.bullets[i]);
        }
    }

    createObject(i) {
        let bullet =
            new Physijs.SphereMesh(
                new THREE.SphereGeometry(this.bulletWidth/4, 20, 20), this.material, 50);
        bullet.position.set(i, -9.5, 0);
        bullet.castShadow = true;
        return bullet;
    }

    setInitPosition(i) {
        this.bullets[i].position.x = i;
        this.bullets[i].position.y = -9.5;
        this.bullets[i].position.z = 0;
        this.bullets[i].__dirtyPosition = true;
    }

    shoot(i, position, target, weapon) {
        this.target[i].set(target.x, target.y, target.z);
        this.bullets[i].position.set(position.x-target.x, position.y+5, position.z-target.z);

        this.bullets[i].setCcdMotionThreshold(10);
        this.bullets[i].setCcdSweptSphereRadius(this.bulletWidth/4);

        this.bullets[i]._dirtyPosition = true;
        this.launched[i] = true;

        let power = 10000;
        let sound = null;

        if (weapon == 0) {
            //import sound
        } else {
            //import sound
        }

        let force = new THREE.Vector3(
            this.target[i].x*power,
            this.target[i].y*power,
            this.target[i].z*power);

        //sound.play;
    }
}