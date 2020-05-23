class Bullet {

    constructor(scene) {

        this.material = new THREE.MeshStandardMaterial(0xeeeeee);
        this.bulletWidth = 1;
        this.launched = false;
        this.bullet = bullet_3D;
        bullet_3D.position.y = height_3D;
        this.direction = new THREE.Vector3 (0,0,0);
        this.initialPosition = new THREE.Vector3(0,0,0);
        this.speed = 0;
        this.scene = scene;
        this.mixer = bulletMixer_3D;
        this.AnimationClips = bulletAnimation_3D;
        this.shootClip = THREE.AnimationClip.findByName(this.AnimationClips, 'Orbit');
        this.shootAction = this.mixer.clipAction(this.shootClip);
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
        this.mixer.update(delta_3D);

        if (this.launched) {
            this.bullet.position.x += this.direction.x*delta_3D * this.speed;
            this.bullet.position.y += this.direction.y*delta_3D * this.speed;
            this.bullet.position.z += this.direction.z*delta_3D * this.speed;

            let detectHit = false;
            for (let i = 0 ; i < this.scene.zombies.length ; i++) {
                if (
                    Math.sqrt(
                        Math.pow(this.bullet.position.x - this.scene.zombies[i].zombie.position.x, 2) +
                        Math.pow(this.bullet.position.y - this.scene.zombies[i].zombie.position.y, 2) +
                        Math.pow(this.bullet.position.z - this.scene.zombies[i].zombie.position.z, 2)
                    ) < 10 && this.scene.zombies[i].zombieHealth != 0
                ) {
                    this.scene.zombies[i].hit();
                    this.bullet.visible = false;
                    this.launched = false;
                    this.scene.stopPlayerShootAnimation();
                    this.scene.updateScore(1);
                    break;
                }
                //console.log("Not within range of this zombie");
            }
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
    }

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