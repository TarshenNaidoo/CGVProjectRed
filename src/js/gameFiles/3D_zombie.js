class Zombie {

    constructor (scene, level,i) {

        this.zombie = new THREE.Object3D();
        let initialX = (Math.random()-0.5)*2*200;
        let initialY = (Math.random()-0.5)*2*200
        this.zombieInitialPosition = new THREE.Vector3(initialX,2,initialY);
        this.zombieModel = zombieImportArray_3D[i][0]; //references the zombie model
        let mesh = new THREE.MeshBasicMaterial({color:0x777777});
        mesh.transparent = true;
        mesh.opacity = 0;
        //hitbox will be used as precisely that. To determine collisions with player and bullet
        this.hitbox = new Physijs.Mesh(
            new THREE.CylinderBufferGeometry(
                zombieScale/2,zombieScale/2,zombieScale*1.5, 20
            ), mesh);
        this.hitbox.position.x = 0.17*zombieScale;
        this.hitbox.position.y = zombieScale*0.75;
        this.zombie.add(this.zombieModel);
        this.zombie.add(this.hitbox);
        this.zombie.position.set(initialX*2,2,initialY);
        //rayCaster would have been used if we implemented global collisions but I dunno
        this.rayCaster = new THREE.Raycaster( this.zombie.position, new THREE.Vector3( 0, 0, 0 ), 0, 1 );
        this.zombieHealth = level;
        this.zombieInitialHealth = level;
        this.scene = scene;
        this.range = zombieScale; //range will be used to determine collisions with player
        this.force = 1; //force applied to player during collisions
        this.rendered = true; //keeps track of whether the zombie is dead or not and should be rendered
        this.timeLimit = 500;
        this.hitTime = performance.now(); //keeps track of the last time the zombie hit the player. This controls the
        //dps of the zombie.

        /*
        Below fetches the animations and mixers, controls, stuff
         */
        this.mixer = zombieImportArray_3D[i][1];
        this.AnimationClips = zombieImportArray_3D[i][2];
        this.walkingClip = THREE.AnimationClip.findByName(this.AnimationClips, 'walkingSpot');
        this.walkingAnimation = this.mixer.clipAction(this.walkingClip);
        this.walkingAnimation.play();
        this.dyingClip = THREE.AnimationClip.findByName(this.AnimationClips, 'dying');
        this.dyingAnimation = this.mixer.clipAction(this.dyingClip);
        this.dyingAnimation.setLoop(THREE.LoopOnce);//dying animation doesn't loop
    }


    //resets the zombie object to default properties
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

    //Confirms if the bullet hit the zombie and that the zombie is alive
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

    //lowers zombie health and plays dying animation if the zombie health is 0
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

    //returns the direction of the zombie to the avatar
    getDirection(){
        let directionToPlayer = new THREE.Vector3();


        directionToPlayer.x = controls_3D.getObject().position.x - this.getPosition().x;
        directionToPlayer.z = controls_3D.getObject().position.z - this.getPosition().z;

        return directionToPlayer;
    }

    //moves the zombie towards the player
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
            /*if the zombie is within range of the player, it will stop moving and attack. +1 is added since it will
            conflict with the collision algorithm
             */
            if (this.getRange() < this.range+this.scene.avatar.range+1){
                if (performance.now() - this.hitTime > this.timeLimit && this.zombieHealth != 0){
                    this.scene.avatar.hit();
                    this.hitTime = performance.now();
                }
            } else {
                this.move();
            }
        } else if (!this.dyingAnimation.isRunning()) {
            /*
            Since the dying animation plays once, the avatar disappears after it is over
             */
            this.rendered = false;
            this.zombie.visible = false;
            this.dyingAnimation.stop();
            this.dyingAnimation.reset();
        }
        this.mixer.update(delta_3D);
    }
}
