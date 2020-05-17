class Avatar {
    constructor(camera) {

        this.avatar = new THREE.Object3D;
        this.camera = camera;
        this.material = new THREE.MeshBasicMaterial({color:0x000000})
        this.material.transparent = true;
        this.material.opacity = 1;
        this.hitBox = new Physijs.BoxMesh(new THREE.BoxGeometry(30,30,30),this.material);
        this.camera.add(this.avatar);
        this.hitBox.add(this.camera);
        this.hitBox.position.x = 20;
        this.hitBox.position.z = -50;
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
        return this.hitBox;
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
        this.velocity.y += 100;
    }

    simGravity(delta){
        this.velocity.y -= 9.8 * this.mass * delta;
        controls.getObject().position.y += this.velocity.y * delta;

        if (controls.getObject().position.y <= 10) {
            controls.getObject().position.y = 10;
            this.velocity.y = 0;
        }
    }

    move(delta, moveForward, moveBackward, moveLeft, moveRight) {
        this.velocity.x -= this.velocity.x * 10 * delta; //approximates to 0 with no movement input
        this.velocity.z -= this.velocity.z * 10 * delta; //approximates to 0 with no movement input

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
        //console.log("velocity x:" + this.velocity.x + ", velocity z: " + this.velocity.z);
        //console.log("delta: " + delta);
        //if (velocity.x < 0.1 && moveLeft === false && moveRight === false) {velocity.x = 0;}
        //if (velocity.z < 0.1 && moveForward === false && moveRight === false) {velocity.z = 0;}
        //this.hitBox.setLinearVelocity(velocity);

        //this.camera.position.x += (-velocity.x * delta);
        //this.camera.position.z += (-velocity.z * delta);
        //this.hitBox.position.z += velocity.z*delta;
        //this.hitBox.position.x += velocity.x*delta;
        controls.moveForward(-this.velocity.z * delta);
        controls.moveRight(-this.velocity.x * delta)
        this.hitBox.position.y = 3;
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

    //called when user shoots. 'shooting' true in gameStartScript, causing gameScene->animate to call this
    animateWeapon() {
        //Do animation then set shooting to false here
        shooting = false;
    }
}