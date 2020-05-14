class Avatar {
    constructor() {

        this.avatar = new THREE.Object3D;
        this.hp = 100;
        this.controls = controls;
        this.weapon0 = new THREE.Object3D;
        this.weapon1 = new THREE.Object3D;
        this.loadWeapons();
        this.activeWeapon = this.weapon0;
        this.avatar.add(this.activeWeapon);
        this.weaponNumber = 0;
        this.goingUp = true;
        this.recoil = true;
        this.positionLimit = 82;
        this.power = 10000;

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

    getObject(){
        return this.avatar;
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