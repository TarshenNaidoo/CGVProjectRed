class Bullet {

    constructor() {

        this.material = THREE.MeshBasicMaterial({color:0xeeeeee});
        this.bulletWidth = 0.8;
        this.launched = false;
        this.bullet =
            new Physijs.SphereMesh(
                new THREE.SphereGeometry(this.bulletWidth/4, 20, 20), this.material, 50);
        this.bullet.castShadow = true;
        this.bullet.position.x = 0;
        this.bullet.position.y = -9.5;
        this.bullet.position.z = 0;
        this.bullet._dirtyPosition = true;
        this.target = new THREE.Vector3 (0,0,0);
    }

    getLaunched() {
        return this.launched;
    }

    resetLaunch(){
        this.launched = false;
    }

    getParameters(i) {
        let parameters = {x: this.bullet.position.x, y: this.bullet.position.y,
            z: this.bullet.position.z, radius: this.bulletWidth/2};
        return parameters;
    }

    shoot(position, target, power) {
        this.target.set(target.x, target.y, target.z);
        this.bullet.position.set(position.x-target.x, position.y+5, position.z-target.z);

        this.bullet.setCcdMotionThreshold(10);
        this.bullet.setCcdSweptSphereRadius(this.bulletWidth/4);

        this.bullet.__dirtyPosition = true;
        this.launched = true;

        let sound = null;
        let force = new THREE.Vector3(
            this.target.x*power,
            this.target.y*power,
            this.target.z*power);

        //sound.play;

        this.bullet.applyCentralImpulse(force);
    }
}