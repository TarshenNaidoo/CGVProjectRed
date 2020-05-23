class Avatar {
    constructor(scene) {

        this.avatar = new THREE.Object3D;
        this.scene = scene;
        controls_3D.getObject().add(this.avatar);
        this.cameraHeight = height_3D;
        controls_3D.getObject().position.y = this.cameraHeight;
        this.rayCaster = new THREE.Raycaster( controls_3D.getObject().position, new THREE.Vector3( 0, - 1, 0 ), 0, 2 );
        this.canJump = true;
        this.hp = 100;
        this.controls = controls_3D;
        this.weapon0 = player_3D;
        this.mixer = playerMixer_3D;
        this.AnimationClips = playerAnimation_3D;
        this.lightAttackClip = THREE.AnimationClip.findByName(this.AnimationClips, 'LightAttack');
        this.playerLightAttack = this.mixer.clipAction(this.lightAttackClip);
        //this.playerLightAttack.setLoop(THREE.LoopOnce);
        this.moveClip = THREE.AnimationClip.findByName(this.AnimationClips, 'ManWalking');
        this.playerMove = this.mixer.clipAction(this.moveClip);
        this.IdleClip = THREE.AnimationClip.findByName(this.AnimationClips, 'ManIdle');
        this.playerIdle = this.mixer.clipAction(this.IdleClip);
        this.playerIdle.play();
        this.weapon1 = new THREE.Object3D;
        this.activeWeapon = this.weapon0;
        this.avatar.add(this.activeWeapon);
        this.weaponNumber = 0;
        this.speed = 150;
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.mass = 20;

    }

    getSpeed(){
        return this.speed;
    }

    getObject(){
        return this.avatar;
    }

    loadWeapons() {
        //load weapon 0 and set this.activeWeapon to this

        //load weapon 1
    }

    getPosition() {
        let pos = new THREE.Vector3();
        pos.x = this.avatar.position.x;
        pos.y = this.avatar.position.y;
        pos.z = this.avatar.position.z;
        return pos;
    }

    setInitialPosition() {
        this.avatar.position.set(0,2.5,0);
    }

    getActiveWeapon() {
        return this.weaponNumber;
    }

    hit() {
        if (this.hp > 0) {
            this.hp--;
            this.scene.updateHealth();
        }
    }

    shoot() {
        if (this.playerLightAttack.isRunning()){
            this.playerLightAttack.stop();
            this.playerLightAttack.reset();
        }
        this.playerLightAttack.play();
    }

    jump() {
        if (this.canJump){
            this.velocity.y += 100;
            this.canJump = false;
        }
    }

    move() {

        this.velocity.x -= this.velocity.x * 10 * delta_3D;
        this.velocity.z -= this.velocity.z * 10 * delta_3D;
        this.direction.z = Number(moveForward_3D) - Number(moveBackward_3D);
        this.direction.x = Number(moveRight_3D) - Number(moveLeft_3D);
        this.direction.normalize();

        if ( moveForward_3D || moveBackward_3D ) this.velocity.z -= this.direction.z * 400.0 * delta_3D;
        else {
            if (Math.abs(this.velocity.z) < 0.1){this.velocity.z = 0;}
        }
        if ( moveLeft_3D || moveRight_3D ) this.velocity.x -= this.direction.x * 400.0 * delta_3D;
        else {
            if (Math.abs(this.velocity.x) < 0.1){this.velocity.x = 0;}
        }

        controls_3D.moveForward(-this.velocity.z * delta_3D);
        controls_3D.moveRight(-this.velocity.x * delta_3D);

    }

    //called when user presses q or mouse wheel down or up
    changeWeapon() {
        /* not implemented yet
        if (this.weaponNumber == 0) {
            this.weaponNumber = 1;
            this.activeWeapon = this.weapon1;
        } else if (this.weaponNumber == 1) {
            this.weaponNumber = 0;
            this.activeWeapon = this.weapon0;
        }
         */
    }
    animate(){

        this.move();

        //{y movement
        this.rayCaster.origin = (controls_3D.getObject().position);
        //console.log("camera y pos: " + controls.getObject().position.y + ", height minimum: " + this.cameraHeight);
        let yDistanceOffset = 9.8 * this.mass * delta_3D;
        if (!flying_3D) {
            this.velocity.y -= yDistanceOffset;
            console.log(this.velocity.y * delta_3D);
        } else {
            this.velocity.y += 4.5 * this.mass * delta_3D;
        }
        this.rayCaster.far = yDistanceOffset + 0.5;
        let intersections = this.rayCaster.intersectObjects(this.scene.rayCastObjects, true);
        let onObject = intersections.length > 0;
        if ( onObject === true && this.velocity.y < 0) {
            this.velocity.y = Math.max( 0, this.velocity.y );
            this.canJump = true;

        }

        if (
            controls_3D.getObject().position.y + this.velocity.y * delta_3D > 10 &&
            controls_3D.getObject().position.y + this.velocity.y * delta_3D < 490
        ) {
            controls_3D.getObject().position.y += this.velocity.y * delta_3D;
        } else {

            this.velocity.y = 0;
        }
        //}

        //{idle and moving animation control
        if (this.velocity.z != 0 || this.velocity.x != 0) {
            this.playerIdle.paused = true;
            if (this.playerMove.isScheduled()){
                this.playerMove.paused = false;
            } else {
                this.playerMove.play();
            }
        } else {
            if (this.playerMove.isScheduled()){
                this.playerMove.paused = true;
            }
            this.playerIdle.paused = false;
        }

        //skybox bounds check
        if(controls_3D.getObject().position.x < -490) {
            controls_3D.getObject().position.x = -490;
        } else if(controls_3D.getObject().position.x > 490) {
            controls_3D.getObject().position.x = 490;
        } else if(controls_3D.getObject().position.z < -490) {
            controls_3D.getObject().position.z = -490;
        } else if(controls_3D.getObject().position.z > 490) {
            controls_3D.getObject().position.z = 490;
        }

        this.mixer.update(delta_3D);
        //}

    }

    //called when user shoots. 'shooting' true in gameStartScript, causing gameScene->animate to call this
    animateWeapon() {
        //Do animation then set shooting to false here
        shooting_3D = false;
    }
}