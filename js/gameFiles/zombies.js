class Zombies {

    constructor (scene, level) {

        this.zombies = [];
        this.countCollisions = [];
        this.direction = [];
        this.force = level*2;
        this.init = true;
        this.countDead = 0;
        this.zombiesOriginalPos = [];
        this.zomNum = level * 3;
        this.zombieScale = 1;

        this.scene = scene;

        let zLoader = new THREE.ObjectLoader();
        zLoader.load(
            "../models/zombieReworked.json",
            //"models/zombie1.glb",
            function (zombie) {
                //function (gltf) {
                //let zombie = gltf.scene;
                zombie.position.y = 3.2;
                zombie.scale.set(zombieScale,zombieScale,zombieScale);

                zombie.position.z = -210;
                let i;
                let posCon = 6;
                let zombieAlternate = 1;
                for (i = (-this.zomNum/2)*posCon ; i < (this.zomNum/2)*posCon ; i += posCon) {
                    //let newZombie = zombie.clone();
                    let newZombie = new Physijs.Object3D();
                    newZombie.add(zombie.clone());
                    newZombie.position.x = i;
                    newZombie.position.z += 2*zombieAlternate;
                    zombieAlternate *= -1;
                    this.zombies.push(newZombie);
                    let zombiePosition = new THREE.Vector3(
                        newZombie.x,
                        newZombie.y,
                        newZombie.z);
                    this.zombiesOriginalPos.push(zombiePosition);
                    this.scene.add(newZombie);
                }
                scene.add(zombieModels);
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

    addBulletListener (i) {
        let that = this;

        this.zombies[i].addEventListener(('collision,'),
            function(theObjects, speed, rotations, normal) {
                if (that.countCollisions[i] == 1) {
                    //play zombie shot sound

                    scene.updateScore(10);

                    that.countDead++;

                    if (that.countDead == this.zomNum) {
                        scene.level++;
                        scene.newLevel();
                    }
                }
                that.countCollisions[i]++;
            }
        );
    }

    getZombies(i){
        return this.zombies[i];
    }

    getZombiesSize(){
        return this.zombies.length;
    }

    animate()  {
        //do zombie movements here

        if (!this.scene.isPaused) {

        }

        for (let i = 0 ; i < this.zombies.length ; i++) {
            if (this.zombies[i].position.z != this.zombiesOriginalPos[i].z) {
                //scene.level++;
                //scene.newLevel();
                break;
            }
        }
    }
}