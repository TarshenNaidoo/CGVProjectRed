class Avatar {
    constructor(camera, scene) {

        this.avatar = new THREE.Object3D;
        this.hp = 100;
        this.camera = camera;
        this.controls = controls;
        this.loadWeapons();
        this.weapon0;
        this.weapon1;
        this.activeWeapon = this.weapon0;
        this.weaponNumber = 0;
        this.goingUp = true;
        this.recoil = true;
        this.positionLimit = 82;
        this.power = 10000;

        this.avatar.add (this.camera);
    }

    getPower(){
        return this.power;
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
        if (this.goingUp) {
            if (this.avatar.position.y > 15) this.goingUp = false;
            else this.avatar.position.y += 0.5;
        } else {
            if (this.avatar.position.y >= 2 && this.avatar.position.y <= 2.5) {
                jumping = false;
                this.goingUp = true;
            } else this.avatar.position.y -= 0.5;
        }
    }
    // updating the controls for it to be at eye level
    updateControls() {
        controls.getObject().position.set(
            this.avatar.position.x,
            this.avatar.position.y+5,
            this.avatar.position.z);
    }

    moveForward() {
        let target = this.camera.getWorldDirection();
        let nextPosition = target.x + this.avatar.position.x;
        if(nextPosition <= this.positionLimit && nextPosition >= -this.positionLimit)
            this.avatar.translateX( target.x );
        nextPosition = target.z + this.avatar.position.z;
        if(nextPosition <= this.positionLimit && nextPosition >= -this.positionLimit)
            this.avatar.translateZ( target.z );
    }

    moveBackward() {
        let target = this.camera.getWorldDirection();
        let nextPosition = -target.x + this.avatar.position.x;
        if(nextPosition <= this.positionLimit && nextPosition >= -this.positionLimit)
            this.avatar.translateX( -target.x );
        nextPosition = -target.z + this.avatar.position.z;
        if(nextPosition <= this.positionLimit && nextPosition >= -this.positionLimit)
            this.avatar.translateZ( -target.z );
    }

    moveLeft() {
        let target = this.camera.getWorldDirection();
        let nextPosition = target.z + this.avatar.position.x;
        if(nextPosition <= this.positionLimit && nextPosition >= -this.positionLimit)
            this.avatar.translateX( target.z );
        nextPosition = -target.x + this.avatar.position.z;
        if(nextPosition <= this.positionLimit && nextPosition >= -this.positionLimit)
            this.avatar.translateZ( -target.x );
    }

    moveRight() {
        let target = this.camera.getWorldDirection();
        let nextPosition = -target.z + this.avatar.position.x;
        if(nextPosition <= this.positionLimit && nextPosition >= -this.positionLimit)
            this.avatar.translateX( -target.z );
        nextPosition = target.x + this.avatar.position.z;
        if(nextPosition <= this.positionLimit && nextPosition >= -this.positionLimit)
            this.avatar.translateZ( target.x );
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