class Zombie {

    constructor (scene, level, x, y, z, i) {

        this.zombie = new THREE.Object3D();
        this.zombieInitialPosition = new THREE.Vector3(x,y,z);
        this.zombieModel = zombieImportArray_3D[i][0];
        let mesh = new THREE.MeshBasicMaterial({color:0x777777});
        mesh.transparent = true;
        mesh.opacity = 0;
        this.hitbox = new Physijs.Mesh(
            new THREE.CylinderBufferGeometry(
                zombieScale/2,zombieScale/2,zombieScale*1.5, 20
            ), mesh);
        this.hitbox.position.x = 0.17*zombieScale;
        this.hitbox.position.y = zombieScale*0.75;
        this.zombie.add(this.zombieModel);
        this.zombie.add(this.hitbox);
        this.zombie.position.set(x*2,y,z);
        this.direction = [];
        this.rayCaster = new THREE.Raycaster( this.zombie.position, new THREE.Vector3( 0, 0, 0 ), 0, 1 );
        this.zombieHealth = level;
        this.zombieInitialHealth = level;
        this.scene = scene;
        this.range = zombieScale;
        this.force = 1;
        this.rendered = true;
        this.hitTime = performance.now();

        this.mixer = zombieImportArray_3D[i][1];
        this.AnimationClips = zombieImportArray_3D[i][2];
        this.walkingClip = THREE.AnimationClip.findByName(this.AnimationClips, 'walkingSpot');
        this.walkingAnimation = this.mixer.clipAction(this.walkingClip);
        this.walkingAnimation.play();
        this.dyingClip = THREE.AnimationClip.findByName(this.AnimationClips, 'dying');
        this.dyingAnimation = this.mixer.clipAction(this.dyingClip);
        this.dyingAnimation.setLoop(THREE.LoopOnce);
    }

    reset(){
        this.zombie.position.set(this.zombieInitialPosition.x,this.zombieInitialPosition.y,this.zombieInitialPosition.z);
        this.zombieHealth = this.zombieInitialHealth;
        this.rendered = true;
        this.zombie.visible = true;
        if (this.walkingAnimation.isRunning()){
            this.walkingAnimation.paused = true;
        }
        this.walkingAnimation.reset();
    }

    getObject(){
        return this.zombie;
    }

    getPosition(){
        return new THREE.Vector3(
            this.zombie.position.x + this.hitbox.position.x,
            this.zombie.position.y + this.hitbox.position.y,
            this.zombie.position.z + this.hitbox.position.z,
        );
    }

    confirmHit(x,y,z){
        if (
            Math.sqrt(
                Math.pow(x - this.getPosition().x, 2) +
                Math.pow(y - this.getPosition().y, 2) +
                Math.pow(z - this.getPosition().z, 2)
            ) < this.range && this.zombieHealth >= 0
        ){
            this.getHit();
            return true;
        } else {
            return false;
        }
    }

    getHit(){
        this.zombieHealth--;
        if (this.zombieHealth === 0) {
            if (this.walkingAnimation.isRunning()) {
                this.walkingAnimation.stop();
                this.walkingAnimation.reset();
            }
            this.dyingAnimation.play();
        }
    }

    getRange(){
        let directionToPlayer = this.getDirection();
        let radius = Math.sqrt(Math.pow(directionToPlayer.x, 2) + Math.pow(directionToPlayer.z,2));
        return radius;
    }

    getDirection(){
        let directionToPlayer = new THREE.Vector3();


        directionToPlayer.x = controls_3D.getObject().position.x - this.getPosition().x;
        directionToPlayer.z = controls_3D.getObject().position.z - this.getPosition().z;

        return directionToPlayer;
    }

    move(){
        let directionToPlay = this.getDirection();
        directionToPlay.normalize();

        this.zombie.lookAt(controls_3D.getObject().position.x, this.zombie.position.y, controls_3D.getObject().position.z);
        let speed = 0.1;
        this.zombie.position.x += directionToPlay.x * speed;
        this.zombie.position.z += directionToPlay.z * speed;

    }

    animate()  {
        if (this.zombieHealth > 0){
            if (this.getRange() < this.range+this.scene.avatar.range+1){
                if (performance.now() - this.hitTime > 500 && this.zombieHealth != 0){
                    console.log("true");
                    this.scene.avatar.hit();
                    this.hitTime = performance.now();
                }
            } else {
                this.move();
            }
        } else if (!this.dyingAnimation.isRunning()) {
            this.rendered = false;
            this.zombie.visible = false;
            this.dyingAnimation.stop();
            this.dyingAnimation.reset();
        }
        this.mixer.update(delta_3D);
    }
}
