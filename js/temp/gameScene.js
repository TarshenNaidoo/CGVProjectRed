import {Vector3} from "../three.js-master/build/three.module";

class gameScene extends Physijs.Scene {

    constructor(renderer, theCamera) {
        super();
        this.setGravity(new THREE.Vector3(0,-50, 0));
        this.prevTime = performance.now();

        this.camera = theCamera;
        this.createCrosshair(renderer);

        this.avatar = null;
        //this.map = null;
        this.zombies = null;
        //this.skybox = null;
        this.Bullets = null;
        this.bulletsShot = 0;
        this.maxBullets = 20;
        this.actualAmmo = this.maxBullets;
        this.score = 0;
        this.lastScore = 0;
        this.level = 1;

        this.createHUD();

        this.createAvatar();
        this.avatar.loadWeapons();
        this.place = this.createPlace();
        this.createBullets();
        this.createZombies(this.level);

        this.ambientLight = null;
        this.spotLight = null;
        this.createLights();

        this.add(this.place);
    }

    createHUD() {
        let score = document.createElement('div');
        score.id = "score";
        score.style.position = 'absolute';
        score.style.width = 1;
        score.style.height = 1;
        score.innerHTML = "Score: " + this.score;
        score.style.top = 50 + 'px';
        score.style.left = 50 + 'px';
        score.style.fontSize = 50 + 'px';
        score.style.color = "white";
        document.body.appendChild(score);

        let ammo = document.createElement('div');
        ammo.id = "ammo";
        ammo.style.position = 'absolute';
        ammo.style.width = 1;
        ammo.style.height = 1;
        ammo.innerHTML = "Ammo: " + this.actualAmmo;
        ammo.style.top = 100 + 'px';
        ammo.style.left = 50 + 'px';
        ammo.style.fontSize = 50 + 'px';
        ammo.style.color = "white";
        document.body.appendChild(ammo);

        let level = document.createElement('div');
        level.id = "level";
        level.style.position = 'absolute';
        level.style.width = 1;
        level.style.height = 1;
        level.innerHTML = "Level: " + this.level;
        level.style.top = 150 + 'px';
        level.style.left = 50 + 'px';
        level.style.fontSize = 50 + 'px';
        level.style.color = "white";
        document.body.appendChild(level);

    }

    updateAmmo() {
        let text = document.getElementById("ammo");
        text.innerHTML = "Ammo: " + this.actualAmmo;
    }

    updateScore (increaseScore) {
        let text = document.getElementById("score");
        this.score += increaseScore;
        text.innerHTML = "Score " + this.score;
    }

    updateLevel () {
        let level = document.getElementById("level");
        level.innerHTML = "Level: " + this.level;
    }

    createCrosshair(renderer) {
        let crosshair = new Crosshair();
        this.camera.add(crosshair);

        //center the crosshair
        let cHPX = 50; //crosshair percent X
        let cHPY = 50; //crosshair percent Y
        let cHPosX = (cHPX/100) * 2 - 1;
        let cHPosY = (cHPY/100) * 2 - 1;
        crosshair.position.set (cHPosX, cHPosY, -0.3);
    }
    //this creates the lights for the scene. If the scene already has lights, we can comment this out
    createLights() {
        this.AmbientLight = new THREE.AmbientLight(0xccddee, 0.35);
        this.add (this.AmbientLight);

        this.apotLight = new THREE.Spotlight(0xffffff);
        this.spotLight.position.set(0,500,1000);
        this.spotLight.intensity = 1;
        this.spotLight.castShadow = true;

        this.spotLight.shadow.mapSize.width = 2048;
        this.spotLight.shadow.mapSize.height = 2048;
        this.add(this.spotLight);
    }

    //this creates the 'place' as it were complete with a skybox and map
    createPlace(){
        let place = new THREE.Object3D();

        this.skybox = new Skybox();
        place.add(this.skybox);

        //creates the map (actual scene objects like fence, door, etc)
        //note that the map.js file has to be modified to include all objects
        this.map = new Map();
        for (let i = 0 ; i < this.map.getMapSize() ; i++) {
            this.add(this.map.getMap(i));
        }
        return place;
    }

    createAvatar(){
        this.avatar = new Avatar(this.camera, this);
    }

    shoot() {
        if (this.bulletsShot >= this.maxBullets) {
            this.bulletsShot = 0;
            this.actualAmmo = this.maxBullets;
            this.bullets.reload();
        }
        //'shooting' will be false the 2nd time this runs
        if (!shooting) {
            this.bullets.shoot(
                this.bulletsShot,
                this.avatar.getPosition(),
                this.camera.getWorldDirection(),
                this.avatar.getActiveWeapon()
            );
            this.bulletsShot++;
            this.actualAmmo--;
            this.updateAmmo();
        }
    }

    createBullets() {
        // will create bullet material and update here
        /*
        var loader = new THREE.TextureLoader();
        var textura = loader.load ("PLACEHOLDER");
         */
        //this.bullets = new Bullets(this.maxBullets, this, (new THREE.MeshPhongMaterial({map:textura})));
        this.bullets = new Bullets(this.maxBullets, this, (new THREE.MeshBasicMaterial({color:0xeeeeee})));
    }
    createZombies() {
        this.zombies = new Zombies(this, this.level);
    }

    endGame() {
        enableControls = false;
        controls.enabled = false;

        moveForward = false;
        moveForward = false;
        moveBackward = false;
        moveLeft = false;
        moveRight = false;
        jumping = false;

        blocker.style.display = 'block';
        instructions.style.display = '';
        instructions.style.fontSize = "50px";

        instructions.innerHTML = "Final Score: " + this.score + ", press P to play again";
    }

    animate() {
        this.simulate();

        if (moveForward) this.avatar.moveForward();
        if (moveBackward) this.avatar.moveBackward();
        if (moveLeft) this.avatar.moveLeft();
        if (moveRight) this.avatar.moveRight();

        if (jumping) {
            this.avatar.jump();
        }

        if (shooting) {
            this.avatar.animateWeapon();
        }

        this.avatar.updateControls(); //ensures that the controls object and the avatar are aligned

        this.zombies.animate();

        if (this.avatar.hp == 0) {
            this.endGame();
        }
    }

    changeWeapon() {
        this.avatar.changeWeapon();
    }

    getCamera () {
        return this.camera;
    }

    getCameraControls () {
        return this.controls;
    }

    setCameraAspect (anAspectRatio) {
        this.camera.aspect = anAspectRatio;
        this.camera.updateProjectionMatrix();
    }

    newLevel() {
        this.avatar.setInitialPosition();

        if (this.score - this.lastScore != maxAmmo) {
            this.score = this.lastScore + maxAmmo;
        }

        this.updateLevel();

        for (let i = 0 ; i < this.zombies.getZombiesSize() ; i++) {
            this.remove(this.zombies.getZombies(i));
        }
        this.createZombies();
        this.lastScore = this.score;
    }

    newGame(){
        blocker.style.display = 'none';
        enableControls = true;
        controls.enabled = true;
        this.avatar.setInitialPosition();
        this.actualAmmo = maxBullets;
        this.updateAmmo();
        this.score = 0;
        this.updateScore(0);
        this.level = 1;
        this.updateLevel();

        for (var i = 0 ; i < this.zombies.getZombiesSize() ; i++) {
            this.remove(this.zombies.getZombies(i));
        }
        this.createZombies();
    }
}