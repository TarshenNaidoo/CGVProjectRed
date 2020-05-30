class Avatar {
    constructor(scene, x,y,z) {

        this.avatar = new THREE.Object3D;
        this.range = 7.5;
        this.scene = scene;
        controls_3D.getObject().add(this.avatar); //adds avatar to camera
        this.initialPosition = new THREE.Vector3(x,y,z); //sets the initial height
        controls_3D.getObject().position.set(this.initialPosition.x, this.initialPosition.y, this.initialPosition.z);
        //raycaster used for detecting ground underneath player when applying gravity
        this.rayCaster = new THREE.Raycaster( controls_3D.getObject().position, new THREE.Vector3( 0, - 1, 0 ), 0, 2 );
        this.canJump = true;
        this.hp = 100;
        this.controls = controls_3D;
        this.weapon0 = player_3D; // this is the player model
        this.mixer = playerMixer_3D; //contains animation data
        this.AnimationClips = playerAnimation_3D; //contains animation data
        this.lightAttackClip = THREE.AnimationClip.findByName(this.AnimationClips, 'LightAttack');
        this.playerLightAttack = this.mixer.clipAction(this.lightAttackClip);
        this.moveClip = THREE.AnimationClip.findByName(this.AnimationClips, 'ManWalking');
        this.playerMove = this.mixer.clipAction(this.moveClip);
        this.IdleClip = THREE.AnimationClip.findByName(this.AnimationClips, 'ManIdle');
        this.playerIdle = this.mixer.clipAction(this.IdleClip);
        this.playerIdle.play();
        this.weapon1 = new THREE.Object3D; //secondary model if implemented
        this.activeWeapon = this.weapon0;
        this.avatar.add(this.activeWeapon); //adds model to main avatar group
        this.weaponNumber = 0; //keeps track of current avatar model
        this.speed = 150; //controls the speed of the bullet when shooting it
        this.velocity = new THREE.Vector3(); // Force applied to the player model each frame. Is updated each frame
        this.direction = new THREE.Vector3(); //direction of the player. Usually normalized
        this.mass = 35; //mass of the player. Not necessarily in KGs
        this.force = 40;

        this.directionalLightObject = new THREE.Object3D();
        this.directionalLightObject.position.set(
            this.scene.crosshair.position.x,
            this.scene.crosshair.position.y,
            this.scene.crosshair.position.z
        )

        /*
        this.directionalLight = new THREE.DirectionalLight(0xffffff,1);
        this.directionalLight.target = this.scene.crosshair;
        controls_3D.getObject().add(this.directionalLight);
         */

    }

    reset(){
        if (this.playerLightAttack.isRunning()){
            this.playerLightAttack.stop();
            this.playerLightAttack.reset();
        }
        this.setInitialPosition();
        this.hp = 100;
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

    setInitialPosition() {
        this.controls.position.set(this.initialPosition.x, this.initialPosition.y+5, this.initialPosition.z);
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

    /*
    increases velocity by 100. this.canJump is set to false when the player hits 'space' and is set to true when
    then avatar is on a object in the raycasting array in the scene class
     */
    jump() {
        if (this.canJump && jumping_3D){
            this.velocity.y += 100;
            this.canJump = false;
        }
    }

    /*
    Function applies a small amount of friction that approximates velocity to 0. Gets the x and z direction movement
    then normalizes it to ensure consistent movement in all directions. Acceleration is then applied to the velocity
    but will have diminishing returns since the friction code lines will eventually reverse last frame's acceleration
    applied.
     */
    move() {
        this.velocity.x -= this.velocity.x * 10 * delta_3D; //simulates friction
        this.velocity.z -= this.velocity.z * 10 * delta_3D; //simulates friction
        this.direction.z = Number(moveForward_3D) - Number(moveBackward_3D); //determines z direction
        this.direction.x = Number(moveRight_3D) - Number(moveLeft_3D); //determines x direction
        this.direction.normalize(); //normalizes direction vector if there is x and z movement


        if ( moveForward_3D || moveBackward_3D ) this.velocity.z -= this.direction.z * this.force * 10 * delta_3D; //applies force to direction vector and adds to velocity
        else {
            if (Math.abs(this.velocity.z) < 0.1){this.velocity.z = 0;} // sets velocity to 0 so there isn't a hyperbola
        }
        if ( moveLeft_3D || moveRight_3D ) this.velocity.x -= this.direction.x * this.force * 10 * delta_3D; //applies force to direction vector and adds to velocity
        else {
            if (Math.abs(this.velocity.x) < 0.1){this.velocity.x = 0;} // sets velocity to 0 so there isn't a hyperbola
        }

        this.controls.moveForward(-this.velocity.z * delta_3D); //final movement offset
        this.controls.moveRight(-this.velocity.x * delta_3D); //final movement offset

    }

    /*
    Function will set the raycaster to the avatar's origin. Decrease velocity for gravity or increase velocity if the
    player is flying. Objects in raycasting array will be checked for intersections. The closet object's distance will
    be checked. And if it is closer than a certain distance (initial y position for camera), velocity will be set to 0
    to ensure that the player isn't 'shorter' or 'taller' than when they started the game. This will work for any height
    level and for any object. So the player is always a certain height above the floor they are on
     */
    applyGravity(){
        this.rayCaster.origin = (this.getAvatarPosition()); //updates raycaster origin to avatar's origin
        let yDistanceOffset = 9.8 * this.mass * delta_3D; //absolute value of gravity

        //if the player is not flying, gravity will be applied, otherwise a force to make the player fly is applied

        if (!flying_3D) {
            this.velocity.y -= yDistanceOffset;
        } else {
            this.velocity.y += 4.5 * this.mass * delta_3D;
        }

        //makes sure the raycaster can detect everything within the next application of gravity
        this.rayCaster.far = yDistanceOffset * delta_3D + this.initialPosition.y;
        let intersections = this.rayCaster.intersectObjects(this.scene.rayCastObjects, true);
        let onObject = intersections.length > 0;

        let closetY = 10000000000000000000;

        //console.log(intersections[0]);

        for (let i = 0 ; i < intersections.length ; i++) {
            closetY = Math.min(Math.abs(intersections[i].distance - this.getAvatarPosition().y), closetY);
        }
        //if there are intersections and the player is falling; apply no gravity and enable jumping
        if ( onObject === true && this.velocity.y < 0 && closetY < this.initialPosition.y) {
            this.velocity.y = Math.max( 0, this.velocity.y );
            this.canJump = true;
        }


        this.controls.getObject().position.y += this.velocity.y * delta_3D;
        if (controls_3D.getObject().position.y < this.initialPosition.y){
            controls_3D.getObject().position.y = this.initialPosition.y;
        }
    }

    /*
    This function controls the movement and idle animations of the avatar depending on if they are moving or not
     */
    controlAnimations(){
        if (this.velocity.z != 0 || this.velocity.x != 0) { //if we are moving...
            this.playerIdle.paused = true; //pause idle animation, check if walking animation is running and then walk;
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

        this.mixer.update(delta_3D);
    }

    getAvatarPosition(){
        let position = new THREE.Vector3();
        position.x = this.controls.getObject().position.x + this.avatar.position.x;
        position.y = this.controls.getObject().position.y + this.avatar.position.y;
        position.z = this.controls.getObject().position.z + this.avatar.position.z;

        return position;
    }
    /*
    This function applies force to the player's velocity if the objects in the specific array is within range.
    If within range, get the direction of the object, reverse it normalize and apply a force factor. Then apply that force
    to the velocity vector. the direction of velocity cannot change so it will be a minimum of 0 no matter how many forces
    act upon the avatar. If the avatar is within 0.8 of the collision detection range 'distance', then a big factor
    will be applied to the velocity vector to prevent movement any closer in that direction
     */

    applyCollisions(){
        for (let i = 0 ; i < this.scene.collisionObjects.length ; i++) {

            let avatarPosition = this.getAvatarPosition(); //gets the avatar's position relative to scene
            let distance =
                Math.sqrt(
                    Math.pow(avatarPosition.x - this.scene.collisionObjects[i].getPosition().x,2) +
                    Math.pow(avatarPosition.y - this.scene.collisionObjects[i].getPosition().y,2) +
                    Math.pow(avatarPosition.z - this.scene.collisionObjects[i].getPosition().z, 2)
                ); // distance between avatar and enemy;

            if (i == 0){
                //console.log(distance - (this.range + this.scene.collisionObjects[i].range));
            }

            if (this.range + this.scene.collisionObjects[i].range > distance && this.scene.collisionObjects[i].rendered){
                let xComp = avatarPosition.x - this.scene.collisionObjects[i].getPosition().x//x direction towards enemy
                let yComp = avatarPosition.y - this.scene.collisionObjects[i].getPosition().y//y direction towards enemy
                let zComp = avatarPosition.z - this.scene.collisionObjects[i].getPosition().z//z direction towards enemy

                let collisionDirection = new THREE.Vector3(xComp,yComp,zComp);
                collisionDirection.normalize();
                if ((this.range + this.scene.collisionObjects[i].range) * 0.8 > distance){
                    /* if the player is within a smaller range, a the player's force will be applied in order
                    to prevent movement any closer in the x-z. This works in conjunction with the following lines below
                    the if-else. The player can still move closer but will move over the object instead
                    */
                    collisionDirection.x *= (this.scene.collisionObjects[i].force * this.force);
                    collisionDirection.y *= (this.scene.collisionObjects[i].force * this.force);
                    collisionDirection.z *= (this.scene.collisionObjects[i].force * this.force);
                } else {
                    collisionDirection.x *= this.scene.collisionObjects[i].force;//apply force to opposite direction
                    collisionDirection.y *= this.scene.collisionObjects[i].force;//apply force to opposite direction
                    collisionDirection.z *= this.scene.collisionObjects[i].force;//apply force to opposite direction
                }

                /*
                If you are moving in opposite directions to the directional force, the directional force will be
                applied but will not force you backwards
                */

                //the following apply only if the 2 vectors collide (i.e. have opposite directions

                if (!(this.velocity.x * collisionDirection.x > 0)) {
                    this.velocity.x = this.velocity.x + collisionDirection.x;
                }
                if (!(this.velocity.y * collisionDirection.y > 0)) {
                    this.velocity.y = collisionDirection.y;
                }
                if (!(this.velocity.z * collisionDirection.z > 0)) {
                    this.velocity.z = collisionDirection.z;
                }
            }
        }

    }

    checkSkyboxBounds() {
        if(controls_3D.getObject().position.x < -490) {
            controls_3D.getObject().position.x = -490;
        } else if(controls_3D.getObject().position.x > 490) {
            controls_3D.getObject().position.x = 490;
        } else if(controls_3D.getObject().position.z < -490) {
            controls_3D.getObject().position.z = -490;
        } else if(controls_3D.getObject().position.z > 490) {
            controls_3D.getObject().position.z = 490;
        }
    }

    changeWeapon() {

    }
    /*
    note: applyGravity() and move() should be called before applyCollisions() so that the play can't 'ignore'
    collisions by simply overriding it with their own movements
     */
    animate(){

        this.jump();

        this.move();

        this.applyGravity();

        this.applyCollisions();

        this.controlAnimations();

        this.checkSkyboxBounds();

        this.directionalLightObject.position.set(
            this.scene.crosshair.position.x+1,
            this.scene.crosshair.position.y+1,
            this.scene.crosshair.position.z+1
        )

        //}

    }

    //called when user shoots. 'shooting' true in gameStartScript, causing gameScene->animate to call this
    animateWeapon() {
        //Do animation then set shooting to false here
        shooting_3D = false;
    }
}