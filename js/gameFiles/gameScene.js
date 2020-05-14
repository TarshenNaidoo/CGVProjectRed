
class gameScene extends Physijs.Scene {

    constructor(renderer, theCamera) {
        super();
        this.setGravity(new THREE.Vector3(0,-50, 0));
        this.prevTime = performance.now();
        this.isPaused = false;
        this.background =  new THREE.Color (0x87ceeb);
        this.camera = theCamera;

        this.avatar = this.createAvatar();
        //this.camera = theCamera;
        //this.camera.add(this.crosshair);
        this.crosshair = this.createCrosshair();
        this.camera.add(this.crosshair);
        //this.map = null;
        this.zombies = [];
        //this.skybox = null;
        this.bullets = [];
        this.maxBullets = 20;
        this.actualAmmo = this.maxBullets;
        for (let i = 0 ; i < this.maxBullets ; i++){
            this.bullets.push(new Bullet());
        }
        this.reload();
        this.bulletsShot = 0;
        this.score = 0;
        this.lastScore = 0;
        this.level = 1;


        this.createHUD();
        this.avatar.loadWeapons();
        this.place = this.createPlace();
        this.createZombies();

        this.ambientLight = null;
        this.spotLight = null;
        this.createLights();

        this.add(this.place);
    }

    display(){
        this.crosshair.setVisible();
    }

    createHUD() {
        let score = document.createElement('div');
        score.id = "score";
        score.style.position = 'absolute';
        score.style.width = "1";
        score.style.height = "1";
        score.innerHTML = "Score: " + this.score;
        score.style.top = 50 + 'px';
        score.style.left = 50 + 'px';
        score.style.fontSize = 25 + 'px';
        score.style.color = "white";
        document.body.appendChild(score);

        let ammo = document.createElement('div');
        ammo.id = "ammo";
        ammo.style.position = 'absolute';
        ammo.style.width = "1";
        ammo.style.height = "1";
        ammo.innerHTML = "Ammo: " + this.actualAmmo;
        ammo.style.top = 100 + 'px';
        ammo.style.left = 50 + 'px';
        ammo.style.fontSize = 25 + 'px';
        ammo.style.color = "white";
        document.body.appendChild(ammo);


        let level = document.createElement('div');
        level.id = "level";
        level.style.position = 'absolute';
        level.style.width = "1";
        level.style.height = "1";
        level.innerHTML = "Level: " + this.level;
        level.style.top = 150 + 'px';
        level.style.left = 50 + 'px';
        level.style.fontSize = 25 + 'px';
        level.style.color = "white";
        document.body.appendChild(level);

        let health = document.createElement('div');
        health.id = "health";
        health.style.position = 'absolute';
        health.style.width = "1";
        health.style.height = "1";
        health.innerHTML = "HP: " + this.avatar.hp;
        health.style.bottom = 100 + 'px';
        health.style.left = 50 + 'px';
        health.style.fontSize = 25 + 'px';
        health.style.color = "red";
        //health.innerHTML.fontcolor("red");
        document.body.appendChild(health);
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

    createCrosshair() {
        let crosshair = new Crosshair();

        //center the crosshair
        let cHPX = 50; //crosshair percent X
        let cHPY = 50; //crosshair percent Y
        let cHPosX = (cHPX/100) * 2 - 1;
        let cHPosY = (cHPY/100) * 2 - 1;
        crosshair.position.set (cHPosX, cHPosY, -0.3);
        return crosshair;
    }
    //this creates the lights for the scene. If the scene already has lights, we can comment this out
    createLights() {
        this.ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
        this.add (this.ambientLight);
        //let pointlight = new THREE.PointLight(0x333333,1);
        //this.add(pointlight);

        this.spotLight = new THREE.SpotLight(0xffffff);
        this.spotLight.position.set(0,10,0);
        this.spotLight.intensity = 1;
        this.spotLight.castShadow = true;

        this.spotLight.shadow.mapSize.width = 2048;
        this.spotLight.shadow.mapSize.height = 2048;
        this.add(this.spotLight);
    }

    //this creates the 'place' as it were complete with a skybox and map
    createPlace(){
        let place = new THREE.Object3D();

        //uncomment when skybox is done
        //this.skybox = new Skybox();
        //place.add(this.skybox);

        //creates the map (actual scene objects like fence, door, etc)
        //note that the map.js file has to be modified to include all objects

        //map.js has not been added
        //this.map = new Map();
        //for (let i = 0 ; i < this.map.getMapSize() ; i++) {
        //    this.add(this.map.getMap(i));
        //}
        return place;
    }

    createAvatar(){
        let avatar = new Avatar();
        this.camera.add(avatar.getObject());
        return avatar;
    }

    reload() {
        for (let i = 0 ; i < this.bullets.length ; i++) {
            this.bullets[i] = new Bullet();
        }
        this.actualAmmo = this.maxBullets;
    }
    shoot() {
        if (this.actualAmmo <= 0) {
            this.reload();
        }
        //'shooting' will be false the 2nd time this runs
         else if (!shooting) {
            this.bullets[this.maxBullets-this.actualAmmo].shoot(
                this.avatar.getPosition(),
                this.camera.getWorldDirection(),
                this.avatar.getPower()
            );
            this.actualAmmo--;
        }
        this.updateAmmo();
    }


    async createZombies() {
        let gltf = await import('../three.js-master/examples/jsm/loaders/GLTFLoader.js');
        let zLoader = new gltf.GLTFLoader();
        let that = this;
        zLoader.load(
            '../models/zombie1.glb',
            //"models/zombie1.glb",
            function (zombieScene) {
                //function (gltf) {
                //let zombie = gltf.scene;
                let zombie = zombieScene.scene;
                let posCon = 6;
                let zombieAlternate = 1;
                let zombieNum = 5;
                for (let i = (-zombieNum/2)*posCon ; i < (zombieNum/2)*posCon ; i += posCon) {
                    //let newZombie = zombie.clone();

                    let physicsZombie = new Physijs.BoxMesh(
                        new THREE.BoxGeometry(zombie.geometry),
                        //zombie.geometries,
                        new THREE.MeshBasicMaterial({opacity:0.0})
                        //zombie.material
                    );

                    let newZombie = new Zombie(physicsZombie,that.level);
                    //console.log("here");
                    newZombie.setInitialPosition(i * 5,newZombie.getPosition().y,i + i * zombieAlternate)
                    zombieAlternate *= -1;
                    that.zombies.push(newZombie);
                    that.add(newZombie.zombie);
                    //console.log("help");
                }
                //checkIfLoaded();

            },
            function (xhr) {
                console.log('Zombie model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
            },
            function (err) {
                console.error('Error loading Zombie model: ' + err);
            }
        );
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

        if (moveForward)
        if (moveBackward)
        if (moveLeft)
        if (moveRight)

        if (jumping) {

        }
        if (sceneChildrenDisplayOnce) {
            //console.log("Children: " + this.children.length);
            sceneChildrenDisplayOnce  = false;
        }
        if (shooting) {
            this.avatar.animateWeapon();
        }

        for (let i = 0 ; i < this.zombies.length ; i++) {
            this.zombies[i].animate();
        }

        if (this.avatar.hp === 0) {
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

        if (this.score - this.lastScore !== this.maxBullets) {
            this.score = this.lastScore + this.maxBullets;
        }

        this.updateLevel();

        for (let i = 0 ; i < this.zombies.getZombiesSize() ; i++) {
            this.remove(this.zombies.getZombies(i));
        }
        this.zombies.zombiesOriginalPos = [];
        this.createZombies();
        this.lastScore = this.score;
    }

    newGame(){
        blocker.style.display = 'none';
        enableControls = true;
        controls.enabled = true;
        this.avatar.setInitialPosition();
        this.reload();
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