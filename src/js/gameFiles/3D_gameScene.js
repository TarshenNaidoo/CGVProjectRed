
class gameScene extends Physijs.Scene {//tried to include a physics engine, it was too much effort for too little reward

    constructor(renderer, theCamera) {
        super({fixedTimeStep: delta_3D});
        this.setGravity(new THREE.Vector3(0,-50, 0));
        this.dynamicskybox = null;
        this.createDynamicSkybox();
        this.background =  new THREE.Color (0x87ceeb); //temporary blue background
        this.camera = theCamera;
        this.rayCastObjects = []; //objects that the player can stand on. Excluding objects that can move eg zombies
        this.collisionObjects = []; //objects that the player can collide with and apply a force towards the player

        //contains the avatar's initial position for resets
        this.initialAvatarPosition = new THREE.Vector3(
            controls_3D.getObject().position.x,
            controls_3D.getObject().position.y,
            controls_3D.getObject().position.z
        );
        this.crosshair = this.createCrosshair();
        this.createAvatar();
        this.camera.add(this.crosshair);
        this.level = 1; //increases after all zombies are defeated, controls zombie health and maybe movement
        this.zombies = [];
        this.createZombies();
        this.bullets = [];
        this.maxBullets = 19;
        this.actualAmmo = this.maxBullets; //this decreases after every projectile fired
        for (let i = 0 ; i <= this.maxBullets ; i++){
            this.bullets.push(new Bullet(this));
            this.add(this.bullets[i].getObject());
        }
        this.score = 0;
        this.lastScore = 0; //updated after the game ends to the current game's score
        this.createHUD();
        this.avatar.loadWeapons(); //is used to swap avatar models if we implement it
        this.place = this.createPlace();
        this.sunlight = null; //holds the sun object, now including moon
        this.lanternArray = [];
        this.hemiSphere = null;
        this.createLights();
        this.add(this.place);
        this.rayCastObjects.push(this.place);

        this.puddleContainer = new PuddleContainer();
        this.add(this.puddleContainer.getObject());

        //adds fog to the scene
        this.fog = this.sunlight.getFog().getFog();

        //adds minimap
        this.minimap = new Map();
        this.add(this.minimap.getObject());

        //adds the easter island head
        this.dumbhead();

        //adds reflective obj
        this.mirror = this.createMirror();
        this.add(this.mirror);
        this.rayCastObjects.push(this.mirror);
        //adds puddle
        this.createFunPudd();

        this.treeType1Array = [];
        this.treeType2Array = [];

        this.rockArray = [];

        this.castle = new Castle(); //creates a castle object
        this.collisionObjects.push(this.castle);
        this.rayCastObjects.push(this.castle.getObject());
        this.add(this.castle.getObject());

        this.castleType2 = new CastleType2(); //creates a castle object
        this.collisionObjects.push(this.castleType2);
        this.rayCastObjects.push(this.castleType2.getObject());
        this.add(this.castleType2.getObject());

        this.castleType3 = new CastleType3(); //creates a castle object
        this.collisionObjects.push(this.castleType3);
        this.rayCastObjects.push(this.castleType3.getObject());
        this.add(this.castleType3.getObject());

        for (let i = 0 ; i < treeType1Num_3D ; i++) { //creates tree objects
            let treeType1 = new TreeType1(i, this);
            this.treeType1Array.push(treeType1);
            this.add(treeType1.getObject());
        }


        for (let i = 0 ; i < rockNum_3D ; i++) {
            let rock = new Rocks(i, this);
            this.rockArray.push(rock);
            this.add(rock.getObject());
        }
        
        for (let i = 0 ; i < treeType2Num_3D ; i++) {
            let treeType2 = new TreeType2(i, this);
            this.treeType2Array.push(treeType2);
            this.add(treeType2.getObject());
        }
        

    }

    resetScene(){ //called when 'r' is pressed
        this.avatar.reset();
        this.reloadAmmo();
        for (let i = 0 ; i < this.zombies.length ; i++) {
            this.zombies[i].reset();
        }

        this.score = 0;
        this.updateScore(-this.score);
        this.level = 0;
        this.updateLevel();
        this.updateHealth();

    }

    display(){
        this.crosshair.setVisible();
    }

    /*
    createHud creates the UI with stats
     */

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
        ammo.innerHTML = "Ammo: " + (this.actualAmmo+1);
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

    /*
    updates ammo stat
     */
    updateAmmo() {
        let text = document.getElementById("ammo");
        text.innerHTML = "Ammo: " + (this.actualAmmo+1);
    }

    /*
    updates score stat
     */
    updateScore (increaseScore) {
        let text = document.getElementById("score");
        this.score += increaseScore;
        text.innerHTML = "Score " + this.score;
    }

    /*
    updates level
     */
    updateLevel () {
        let level = document.getElementById("level");
        level.innerHTML = "Level: " + this.level;
    }

    /*
    updates avatar hp
     */
    updateHealth() {
        let health = document.getElementById("health");
        health.innerHTML = "HP: " + this.avatar.hp;
    }

    /*
    creates the crosshair
     */
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
        this.sunlight = new Sky(0,300,0);
        this.add(this.sunlight.getSky());
        this.hemiSphere = new THREE.HemisphereLight(0xEEEEEE, 0x000000, 0.2);

        for (let i = 0 ; i < lanternNum_3D ; i++) {
            let lantern = new Lantern(i, this);
            this.lanternArray.push(lantern);
            this.add(lantern.getObject());
        }
    }

    /*
    adds static skybox
     */

    createDynamicSkybox(){
        this.dynamicskybox = new DynamicSkybox();
        this.add(this.dynamicskybox.getObject());
    }

    //this creates the 'place' as it were complete with a skybox and map
    createPlace(){

        let vertex = new THREE.Vector3();
        let color = new THREE.Color();

        let place = new THREE.Object3D();
        let floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
        floorGeometry.rotateX( - Math.PI / 2 );

        // vertex displacement

        let position = floorGeometry.attributes.position;

        for ( let i = 0, l = position.count; i < l; i ++ ) {

            vertex.fromBufferAttribute( position, i );

            vertex.x += Math.random() * 20 - 10;
            vertex.y += Math.random() * 2;
            vertex.z += Math.random() * 20 - 10;

            position.setXYZ( i, vertex.x, vertex.y, vertex.z );

        }

        floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

        position = floorGeometry.attributes.position;
        let colors = [];

        for ( let i = 0, l = position.count; i < l; i ++ ) {

            let randVar = Math.random() * 0.5 + 0.25;
            let randR = randVar + (Math.random() - 0.5) * 0.2;
            let randG = randVar + (Math.random() - 0.5) * 0.2;
            let randB = randVar + (Math.random() - 0.5) * 0.2;
            color.setRGB(randR,randG,randB);
            colors.push( color.r, color.g, color.b );

        }

        floorGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

        let floorMaterial = new THREE.MeshPhongMaterial( { vertexColors: true } );

        let floor = new THREE.Mesh( floorGeometry, floorMaterial );
        floor.receiveShadow = true;
        place.add(floor);
        return place;
    }

    createAvatar(){
        this.avatar = new Avatar(this, this.initialAvatarPosition.x, this.initialAvatarPosition.y, this.initialAvatarPosition.z);
    }

    //this creates reflective shape in game
    createMirror(){

        var mirObj = new THREE.Object3D();
        var cubeGeom = new THREE.PlaneGeometry(6,4,32);
        this.mirrorCubeCamera = new THREE.CubeCamera(0.1, 500, 512);

        this.add(this.mirrorCubeCamera);

        var mirrorCubeMaterial = new THREE.MeshBasicMaterial({color: 0xC0C0C0,side: THREE.DoubleSide,envMap: this.mirrorCubeCamera.renderTarget});
        this.mirrorCube = new THREE.Mesh(cubeGeom, mirrorCubeMaterial);
        this.mirrorCube.position.set(0,10,10);
        this.mirrorCubeCamera.position.set(0,10,10);
        mirObj.add(this.mirrorCube);
        return mirObj;

    }

    //this adds a reflective puddle
    createFunPudd(){
        var x = 0, y = 0;
        var heartShape = new THREE.Shape();
        heartShape.moveTo( x + 5, y + 5 );
        heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
        heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
        heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 10 );
        heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
        heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
        heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x, y);

        this.puddCubeCamera = new THREE.CubeCamera(0.1, 500, 512);
        this.add(this.puddCubeCamera);
        var puddMaterial = new THREE.MeshBasicMaterial({color: 0xb5651d,side: THREE.DoubleSide,envMap: this.puddCubeCamera.renderTarget});
        var geometry = new THREE.ShapeGeometry( heartShape );
        //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.pudd = new THREE.Mesh(geometry, puddMaterial);
        this.add(this.pudd);
        this.pudd.position.set(0,1,5);
        this.pudd.scale.set(0.5,0.5,0.5);
        this.pudd.rotation.set(Math.PI/2,0,0);
        this.puddCubeCamera.position.set(0,1,5);
    }
    stopPlayerShootAnimation() { //stops the shooting animations after the bullet ends it's trajectory
        if (this.avatar.playerLightAttack.isRunning()){
            this.avatar.playerLightAttack.stop();
            this.avatar.playerLightAttack.reset();
        }
    }

    /*
    resets the bullets in play and updates UI
     */
    reloadAmmo() {
        for (let i = 0 ; i < this.bullets.length ; i++) {
            this.bullets[i] = new Bullet(this);
        }
        this.actualAmmo = this.maxBullets;
        bullet_3D.visible = false;
        this.updateAmmo();
    }

    /*
    Controls the shooting method
     */
    shoot() {
        if (this.actualAmmo <= 0) {
            this.reloadAmmo();
        }
        //'shooting' will be false the 2nd time this runs
         else if (!shooting_3D) {
            this.bullets[this.maxBullets-this.actualAmmo].shoot(
                this.camera.position,
                this.avatar.getSpeed()
            );
            this.tracktime = performance.now();
            this.avatar.shoot();
            this.actualAmmo--;
            this.updateAmmo();
        }
    }

    createZombies() {
        for (let i = 0 ; i < zombieNum_3D ; i++){
            let generatedZombie = new Zombie(this, this.level, i)
            this.zombies.push(generatedZombie);

            this.collisionObjects.push(generatedZombie);
            this.rayCastObjects.push(generatedZombie.getObject()); //this is done so that we can stand on the zombie
            this.add(generatedZombie.getObject());
        }
    }

    endGame() {
        enableControls_3D = false;
        controls_3D.enabled = false;

        moveForward_3D = false;
        moveForward_3D = false;
        moveBackward_3D = false;
        moveLeft_3D = false;
        moveRight_3D = false;
        jumping_3D = false;

        blocker.style.display = 'block';
        instructions.style.display = '';
        instructions.style.fontSize = "30px";

        instructions.innerHTML = "Final Score: " + this.score + ", press P to play again";
    }

    /*
    If enableControls_3D is false (i.e. The game is fully paused with a menu,) The player will not be able to move.
    If the game is fully unpaused but dev_enableControls_3D is false ( i.e. 'T' is pressed), the player will be able to
    move and shoot. Zombies will die etc.
     */
    animate() {

        if (enableControls_3D) {

            this.avatar.animate();

            if (shooting_3D) {
                this.avatar.animateWeapon();
            }

            this.minimap.animate(this.avatar.getAvatarPosition());

            /*
            Next 4-5 lines describe the bullet, if currentBullet is 0, there the bullet appears and is stationary.
            Setting it to the the max bullets + 1 fixes it. Yes, the actual array containing the bullets has 1 more
            bullet than in this.maxBullets but somehow this is the conclusion I came to. Dunno if this is a computer
            science sin, I don't care really.
             */
            let currentBullet = this.maxBullets - this.actualAmmo;
            if (currentBullet === 0) {
                currentBullet = this.maxBullets + 1;
            }
            this.bullets[currentBullet - 1].animate();


            if (dev_enableControls_3D) {
                this.sunlight.animate();

                for ( let i = 0 ; i < this.lanternArray.length ; i++) {
                    this.lanternArray[i].animate();
                }

                for (let i = 0; i < this.zombies.length; i++) {
                    this.zombies[i].animate();
                }

                if (this.avatar.hp === 0) {
                    this.endGame();
                }

            }
            this.simulate();
        }
    }
    dumbhead(){
        let listener = new THREE.AudioListener();
        let sound = new THREE.PositionalAudio(listener);

        let audioLoader = new THREE.AudioLoader();
        audioLoader.load( '/../../src/sound/dumdum.mp3', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setRefDistance(30);
            sound.setVolume(0.8);
            sound.play();
        });

        let texture = new THREE.TextureLoader().load('../../src/textures/head.jpg');

        let upperlip = new THREE.Mesh(
            new THREE.CylinderBufferGeometry(5,5,1,50,10,false,0,Math.PI*1.1),
            new THREE.MeshStandardMaterial({side: THREE.DoubleSide,map: texture})
        );

        let lowerlip = new THREE.Mesh(
            new THREE.CylinderBufferGeometry(5,5,1,50,10,false,0,Math.PI*1.1),
            new THREE.MeshStandardMaterial({side: THREE.DoubleSide,map: texture})
        );

        let forehead = new THREE.Mesh(
            new THREE.CylinderBufferGeometry(7,7,13,50,10,false,0,Math.PI*1.1),
            new THREE.MeshStandardMaterial({side: THREE.DoubleSide,map: texture})
        );

        let nose = new THREE.Mesh(
            new THREE.CylinderGeometry(2.5, 2.5, 10, 20),
            new THREE.MeshStandardMaterial({side: THREE.DoubleSide,map: texture})
        );

        let nostril = new THREE.Mesh(
            new THREE.SphereGeometry(5,32,32,0,3.15,0,3.15),
            new THREE.MeshStandardMaterial({side: THREE.DoubleSide,map: texture})
        );

        let nostrilDivisor = new THREE.Mesh(
            new THREE.CircleBufferGeometry(5,50,Math.PI*2,Math.PI),
            new THREE.MeshStandardMaterial({side: THREE.DoubleSide,map: texture})
        );

        nostrilDivisor.rotateX(Math.PI/2);
        nostrilDivisor.rotateY(Math.PI/2);

        nostril.add(nostrilDivisor);

        nostril.rotateX(-Math.PI/2);
        nostril.position.y = -9;

        nose.add(nostril);

        nose.position.z = -8;
        nose.rotateX(Math.PI/12);

        let head = new THREE.Mesh(
            new THREE.CylinderGeometry(10, 10, 40, 64),
            new THREE.MeshStandardMaterial({side: THREE.DoubleSide,map: texture})
        );

        forehead.position.y = 13.5;
        forehead.position.z = -7;
        forehead.rotateY(Math.PI/2);

        upperlip.position.y = -14;
        upperlip.position.z = -7;
        upperlip.rotateY(Math.PI/2);

        lowerlip.position.y = -15.5;
        lowerlip.position.z = -7;
        lowerlip.rotateY(Math.PI/2);

        head.position.y = 22;
        head.position.z = 100;

        head.add(nose);
        head.add(forehead);
        head.add(upperlip);
        head.add(lowerlip);

        this.camera.add(listener);
        this.add(head);

        //bug
        head.add(audioLoader);
    }

    changeWeapon() {
        this.avatar.changeWeapon();
    }

    getCamera () {
        return this.camera;
    }

    setCameraAspect (newAspectRatio) {
        this.camera.aspect = newAspectRatio;
        this.camera.updateProjectionMatrix();
    }

    newLevel() {
        this.avatar.setInitialPosition();

        this.updateLevel();

        for (let i = 0 ; i < this.zombies.length ; i++) {
            this.zombies.pop();
        }
        this.zombies.zombiesOriginalPos = [];
        this.createZombies();
        this.lastScore = this.score;
    }

    newGame(){
        blocker.style.display = 'none';
        enableControls_3D = true;
        dev_enableControls_3D = true;
        controls_3D.enabled = true;
        controls_3D.getObject().position.set(0,10,0);
        this.avatar.hp = 100;
        this.updateHealth();
        this.reloadAmmo();
        this.updateScore(-this.score);
        this.level = 1;
        this.updateLevel();

        for (let i = 0 ; i < this.zombies.length ; i++) {
            this.zombies.pop()
        }
        this.createZombies();
    }
}
