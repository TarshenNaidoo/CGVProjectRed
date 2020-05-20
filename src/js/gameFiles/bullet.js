class Bullet {

    constructor() {

        this.material = new THREE.MeshStandardMaterial(0xeeeeee);
        this.bulletWidth = 1;
        this.launched = false;
        this.bullet = bullet;
        bullet.position.y = height;
        this.direction = new THREE.Vector3 (0,0,0);
        this.initialPosition = new THREE.Vector3(0,0,0);
        this.speed = 0;
    }

    getLaunched() {
        return this.launched;
    }

    resetLaunch(){
        this.launched = false;
    }

    getParameters() {
        return {x: this.bullet.position.x, y: this.bullet.position.y,
            z: this.bullet.position.z, radius: this.bulletWidth/2};
    }

    animate() {

        if (this.launched) {
            this.bullet.position.x += this.direction.x*delta * this.speed;
            this.bullet.position.y += this.direction.y*delta * this.speed;
            this.bullet.position.z += this.direction.z*delta * this.speed;

            if (
                Math.sqrt(
                    Math.pow(
                        this.bullet.position.x-this.initialPosition.x,
                        2
                    ) +
                    Math.pow(
                        this.bullet.position.y - this.initialPosition.y,
                        2
                    ) +
                    Math.pow(this.bullet.position.z - this.initialPosition.z,
                        2
                    )
                ) > 50
            ) {this.bullet.visible = false; this.launched = false}
        }
    }

    shoot(position, speed) {
        this.launched = true;
        this.bullet.visible = true;
        this.speed = speed;
        this.direction.set(camera.getWorldDirection().x, camera.getWorldDirection().y, camera.getWorldDirection().z);
        this.direction.normalize();
        this.bullet.rotation.set(camera.rotation.x, camera.rotation.y-Math.PI/2, camera.rotation.z);
        this.bullet.position.set(camera.position.x + 3*this.direction.x, camera.position.y + 3*this.direction.y, camera.position.z + 3*this.direction.z);

        this.initialPosition.set(camera.position.x, camera.position.y, camera.position.z);

        //let sound = null;

        //sound.play;
    }
}