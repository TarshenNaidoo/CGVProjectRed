class Bullet {

    constructor(scene) {
        this.bulletWidth = 1;
        this.launched = false; //tracks whether the bullet is fired
        this.bullet = bullet_3D;
        bullet_3D.position.y = height_3D; //set the bullets position to the camera's default position
        this.direction = new THREE.Vector3 (0,0,0);
        this.initialPosition = new THREE.Vector3(0,0,0);
        this.speed = 0; //will be overwritten byt the avatar's specified weapon power
        this.scene = scene;
        this.mixer = bulletMixer_3D;
        this.AnimationClips = bulletAnimation_3D;
        this.shootClip = THREE.AnimationClip.findByName(this.AnimationClips, 'Orbit');
        this.shootAction = this.mixer.clipAction(this.shootClip);
    }

    getObject(){
        return this.bullet;
    }

    getParameters() {
        return {x: this.bullet.position.x, y: this.bullet.position.y,
            z: this.bullet.position.z, radius: this.bulletWidth/2};
    }

    move(){

        this.bullet.position.x += this.direction.x*delta_3D * this.speed;
        this.bullet.position.y += this.direction.y*delta_3D * this.speed;
        this.bullet.position.z += this.direction.z*delta_3D * this.speed;
    }

    /*
    Determines whether the bullet is within range of a zombie. It attempts to register a hit. If successful,
    the bullet will stop, turn invisible and stop the player's shooting animation
     */
    confirmHit(){
        for (let i = 0 ; i < this.scene.zombies.length ; i++) {
            if (
                this.scene.zombies[i].confirmHit(
                    this.bullet.position.x,
                    this.bullet.position.y,
                    this.bullet.position.z
                )
            ) {
                this.bullet.visible = false;
                this.launched = false;
                this.scene.stopPlayerShootAnimation();
                this.scene.updateScore(1);
                break;
            }
        }
    }

    /*
    Determine's the bullet's limit in distance from the player.
     */
    checkLimit(){
        if (
            Math.sqrt(
                Math.pow(
                    this.bullet.position.x - this.initialPosition.x,
                    2
                ) +
                Math.pow(
                    this.bullet.position.y - this.initialPosition.y,
                    2
                ) +
                Math.pow(this.bullet.position.z - this.initialPosition.z,
                    2
                )
            ) > 160
        ) {
            if (this.shootAction.isRunning()){
                this.shootAction.stop();
                this.shootAction.reset();
            }
            this.bullet.visible = false;
            this.launched = false;
            this.scene.stopPlayerShootAnimation();
        }
    }

    animate() {
        this.mixer.update(delta_3D);

        if (this.launched) {
            this.move();

            this.confirmHit();

            this.checkLimit();

        }
    }

    /*
    shoot() launches the bullet: playing animations, becoming visible, with the trajectory being the player's current
    facing direction
     */
    shoot(position, speed) {
        if (this.shootAction.isRunning()){
            this.shootAction.stop();
            this.shootAction.reset();
        } else {
            this.shootAction.reset();
        }
        this.shootAction.play();
        this.launched = true;
        this.bullet.visible = true;
        this.speed = speed;
        this.direction.set(camera_3D.getWorldDirection().x, camera_3D.getWorldDirection().y, camera_3D.getWorldDirection().z);
        this.direction.normalize();
        this.bullet.rotation.set(camera_3D.rotation.x, camera_3D.rotation.y-Math.PI/2, camera_3D.rotation.z);
        this.bullet.position.set(camera_3D.position.x + 3*this.direction.x, camera_3D.position.y + 3*this.direction.y, camera_3D.position.z + 3*this.direction.z);

        this.initialPosition.set(camera_3D.position.x, camera_3D.position.y, camera_3D.position.z);

        //let sound = null;

        //sound.play;
    }
}