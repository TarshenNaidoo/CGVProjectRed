class Avatar {
    constructor(scene) {

        this.avatar = new THREE.Object3D;
        this.range = 7.5;
        this.scene = scene;
        controls_3D.getObject().add(this.avatar); //adds avatar to camera
        this.cameraHeight = height_3D; //sets the initial height
        controls_3D.getObject().position.y = this.cameraHeight;
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
        this.avatar.position.set(0,height_3D,0);
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
        if (this.canJump && jumping_3D){
            this.velocity.y += 100;
            this.canJump = false;
        }
    }

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

        controls_3D.moveForward(-this.velocity.z * delta_3D); //final movement offset
        controls_3D.moveRight(-this.velocity.x * delta_3D); //final movement offset

    }

    applyGravity(){
        this.rayCaster.origin = (controls_3D.getObject().position); //updates raycaster origin to camera origin

        let yDistanceOffset = 9.8 * this.mass * delta_3D; //absolute value of gravity

        //if the player is not flying, gravity will be applied, otherwise a force to make the player fly is applied

        if (!flying_3D) {
            this.velocity.y -= yDistanceOffset;
        } else {
            this.velocity.y += 4.5 * this.mass * delta_3D;
        }

        //makes sure the raycaster can detect everything within the next application of gravity
        this.rayCaster.far = yDistanceOffset + 0.5;
        let intersections = this.rayCaster.intersectObjects(this.scene.rayCastObjects, true);
        let onObject = intersections.length > 0;

        //if there are intersections and the player is falling; apply no gravity and enable jumping
        if ( onObject === true && this.velocity.y < 0) {
            this.velocity.y = Math.max( 0, this.velocity.y );
            this.canJump = true;

        }


        controls_3D.getObject().position.y += this.velocity.y * delta_3D;
    }

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
        position.x = controls_3D.getObject().position.x + this.avatar.position.x;
        position.y = controls_3D.getObject().position.y + this.avatar.position.y;
        position.z = controls_3D.getObject().position.z + this.avatar.position.z;

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
                    Math.pow(avatarPosition.x - this.scene.collisionObjects[i][0].x,2) +
                    Math.pow(avatarPosition.y - this.scene.collisionObjects[i][0].y,2) +
                    Math.pow(avatarPosition.z - this.scene.collisionObjects[i][0].z, 2)
                ); // distance between avatar and enemy;

            if (i == 0){
                console.log(distance - (this.range + this.scene.collisionObjects[i][1]));
            }

            if (this.range + this.scene.collisionObjects[i][1] > distance){
                let xComp = avatarPosition.x - this.scene.collisionObjects[i][0].x//x direction towards enemy
                let yComp = avatarPosition.y - this.scene.collisionObjects[i][0].y//y direction towards enemy
                let zComp = avatarPosition.z - this.scene.collisionObjects[i][0].z//z direction towards enemy

                let collisionDirection = new THREE.Vector3(xComp,yComp,zComp);
                collisionDirection.normalize();
                if ((this.range + this.scene.collisionObjects[i][1]) * 0.8 > distance){
                    /* if the player is within a smaller range, a significantly higher force will be applied in order
                    to prevent movement any closer. This works in conjunction with the following lines below
                    the if-else
                    */
                    collisionDirection.x *= (this.scene.collisionObjects[i][2] * this.force);
                    collisionDirection.y *= (this.scene.collisionObjects[i][2] * this.force);
                    collisionDirection.z *= (this.scene.collisionObjects[i][2] * this.force);
                } else {
                    collisionDirection.x *= this.scene.collisionObjects[i][2];//apply force to opposite direction
                    collisionDirection.y *= this.scene.collisionObjects[i][2];//apply force to opposite direction
                    collisionDirection.z *= this.scene.collisionObjects[i][2];//apply force to opposite direction
                }

                /*
                If you are moving in opposite directions to the directional force, the directional force will be
                applied but will not force you backwards
                */

                console.log("velocity.x: " + this.velocity.x + ", " + collisionDirection.x);

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

        //}

    }

    //called when user shoots. 'shooting' true in gameStartScript, causing gameScene->animate to call this
    animateWeapon() {
        //Do animation then set shooting to false here
        shooting_3D = false;
    }
}