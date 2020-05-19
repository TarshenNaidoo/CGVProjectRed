class Avatar {
    constructor(camera, scene) {

        this.avatar = new THREE.Object3D;
        this.scene = scene;
        controls.getObject().add(this.avatar);
        this.cameraHeight = height;
        controls.getObject().position.y = this.cameraHeight;
        console.log(controls.getObject().position.y);
        this.rayCaster = new THREE.Raycaster( controls.getObject().position, new THREE.Vector3( 0, - 1, 0 ), this.cameraHeight, this.cameraHeight );
        this.canJump = true;
        this.hp = 100;
        this.controls = controls;
        this.weapon0 = gun;
        this.weapon1 = new THREE.Object3D;
        this.activeWeapon = this.weapon0;
        this.avatar.add(this.activeWeapon);
        this.weaponNumber = 0;
        this.goingUp = true;
        this.recoil = true;
        this.positionLimit = 82;
        this.power = 10000;

        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.mass = 50;

    }

    getPower(){
        return this.power;
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

    jump() {
        if (this.canJump){
            this.velocity.y += 100;
            this.canJump = false;
        }
    }

    move(delta, moveForward, moveBackward, moveLeft, moveRight) {

        //console.log("velocity x:" + this.velocity.x + ", velocity z: " + this.velocity.z);
        //console.log("delta: " + delta);
        //if (velocity.x < 0.1 && moveLeft === false && moveRight === false) {velocity.x = 0;}
        //if (velocity.z < 0.1 && moveForward === false && moveRight === false) {velocity.z = 0;}
        //this.hitBox.setLinearVelocity(velocity);

        //this.camera.position.x += (-velocity.x * delta);
        //this.camera.position.z += (-velocity.z * delta);
        //this.hitBox.position.z += velocity.z*delta;
        //this.hitBox.position.x += velocity.x*delta;
        //console.log(this.hitBox.position.y);

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



        this.velocity.x -= this.velocity.x * 10 * delta;
        this.velocity.z -= this.velocity.z * 10 * delta;

        this.direction.z = Number(moveForward) - Number(moveBackward);
        this.direction.x = Number(moveRight) - Number(moveLeft);
        this.direction.normalize();

        if ( moveForward || moveBackward ) this.velocity.z -= this.direction.z * 400.0 * delta;
        else {
            if (this.velocity.z > -0.1){this.velocity.z = 0;}
        }
        if ( moveLeft || moveRight ) this.velocity.x -= this.direction.x * 400.0 * delta;
        else {
            if (this.velocity.x > -0.1){this.velocity.x = 0;}
        }

        controls.moveForward(-this.velocity.z * delta);
        controls.moveRight(-this.velocity.x * delta);



        this.rayCaster.ray.origin.copy((controls.getObject().position.clone()));
        //console.log("camera y pos: " + controls.getObject().position.y + ", height minimum: " + this.cameraHeight);
        this.velocity.y -= 9.8 * this.mass * delta;


        let intersections = this.rayCaster.intersectObjects(this.scene.objects);

        let onObject = intersections.length > 0;

        if ( onObject === true ) {
            console.log("true");
            velocity.y = Math.max( 0, velocity.y );
            this.canJump = true;

        }


        if ( controls.getObject().position.y < this.cameraHeight && this.velocity.y < 0) {

            this.velocity.y = 0;
            this.canJump = true;

        }
        controls.getObject().position.y += this.velocity.y * delta;

    }

    //called when user shoots. 'shooting' true in gameStartScript, causing gameScene->animate to call this
    animateWeapon() {
        //Do animation then set shooting to false here
        shooting = false;
    }
}