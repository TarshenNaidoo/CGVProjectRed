
class gameScene extends Physijs.Scene {

    constructor(renderer, theCamera, controls) {
        super({fixedTimeStep: delta_3D});
        this.setGravity(new THREE.Vector3(0,-50, 0));
        this.skybox = null;
        this.createSkybox();
        this.isPaused = false;
        this.background =  new THREE.Color (0x87ceeb);
        this.camera = theCamera;
        this.rayCastObjects = [];
        this.createAvatar();
        this.crosshair = this.createCrosshair();
        this.camera.add(this.crosshair);
        this.level = 1;
        this.zombies = [];
        this.createZombies();
        this.bullets = [];
        this.maxBullets = 19;
        this.actualAmmo = this.maxBullets;
        for (let i = 0 ; i <= this.maxBullets ; i++){
            this.bullets.push(new Bullet(this));
            this.add(this.bullets[i].bullet);
        }
        this.score = 0;
        this.lastScore = 0;
        this.createHUD();
        this.avatar.loadWeapons();
        this.place = this.createPlace();
        this.sunlight = null;
        this.createLights();
        this.add(this.place);
        this.rayCastObjects.push(this.place);
        this.tracktime = 0;
    }

    resetScene(){
        controls_3D.getObject().position.set(0,10,0);
        this.reloadAmmo();
        if (this.avatar.playerLightAttack.isRunning()){
            this.avatar.playerLightAttack.stop();
            this.avatar.playerLightAttack.reset();
        }
        for (let i = 0 ; i < this.zombies.length ; i++) {
            this.zombies[i].zombie.position.set((-zombieNum_3D + i)*5, 2, -50)
            this.zombies[i].zombieHealth = this.level;
            this.zombies[i].zombieHit = 0;
            this.zombies[i].zombie.visible = true;
        }

        this.score = 0;
        this.updateScore(-this.score);
        this.level = 0;
        this.updateLevel();
        this.avatar.hp = 100;
        this.updateHealth();

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

    updateAmmo() {
        let text = document.getElementById("ammo");
        text.innerHTML = "Ammo: " + (this.actualAmmo+1);
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

    updateHealth() {
        let health = document.getElementById("health");
        health.innerHTML = "HP: " + this.avatar.hp;
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
        this.sunlight = new Sun(0,300,0);
        this.add(this.sunlight.getObject());
    }

    createSkybox(){
        this.skybox = new Skybox();
        this.add(this.skybox.getSkybox());
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

            //color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
            let randVar = Math.random() * 0.5 + 0.25;
            let randR = randVar + (Math.random() - 0.5) * 0.2;
            let randG = randVar + (Math.random() - 0.5) * 0.2;
            let randB = randVar + (Math.random() - 0.5) * 0.2;
            //console.log(randVar)
            color.setRGB(randR,randG,randB);
            colors.push( color.r, color.g, color.b );

        }

        floorGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

        let floorMaterial = new THREE.MeshPhongMaterial( { vertexColors: true } );

        let floor = new THREE.Mesh( floorGeometry, floorMaterial );

        //let physiFloor = new Physijs.PlaneMesh(floorGeometry,floorMaterial, 10);
        //place.add(floor);
        place.add(floor)
        floor.receiveShadow = true;
        //let worldModel = new World();
        //place.add(worldModel.getWorld());
        return place;
    }

    createAvatar(){
        this.avatar = new Avatar(this);
    }

    stopPlayerShootAnimation() {
        if (this.avatar.playerLightAttack.isRunning()){
            this.avatar.playerLightAttack.stop();
            this.avatar.playerLightAttack.reset();
        }

        //console.log(performance.now()- this.tracktime);
    }

    reloadAmmo() {
        for (let i = 0 ; i < this.bullets.length ; i++) {
            this.bullets[i] = new Bullet(this);
        }
        this.actualAmmo = this.maxBullets;
        bullet_3D.visible = false;
        this.updateAmmo();
    }
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
            let generatedZombie = new Zombie(this, this.level, (-zombieNum_3D + i)*5, 2, -50, i)
            this.zombies.push(generatedZombie);
            this.add(generatedZombie.zombie);
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
        instructions.style.fontSize = "50px";

        instructions.innerHTML = "Final Score: " + this.score + ", press P to play again";
    }

    animate() {

        this.avatar.animate();

        this.sunlight.animate();

        if (shooting_3D) {
            this.avatar.animateWeapon();
        }

        let currentBullet = this.maxBullets-this.actualAmmo;
        if (currentBullet === 0) {currentBullet = this.maxBullets+1;}

        this.bullets[currentBullet-1].animate();

        for (let i = 0 ; i < this.zombies.length ; i++) {
            this.zombies[i].animate();
        }

        if (this.avatar.hp === 0) {
            this.endGame();
        }
        this.simulate();
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
        enableControls_3D = true;
        controls_3D.enabled = true;
        controls_3D.getObject().position.set(0,10,0);
        this.avatar.hp = 100;
        this.updateHealth();
        this.reloadAmmo();
        this.updateScore(-this.score);
        this.level = 1;
        this.updateLevel();

        for (var i = 0 ; i < this.zombies.length ; i++) {
            this.zombies.pop()
        }
        this.createZombies();
    }
}
