class Zombie {

    constructor (level, x, y, z, i) {

        this.zombie = new THREE.Object3D();
        let mesh = new THREE.MeshBasicMaterial({color:0x777777});
        mesh.transparent = true;
        mesh.opacity = 0.25;
        this.hitbox = new Physijs.Mesh(
            new THREE.BoxBufferGeometry(
                7,10,7
            ), mesh);
        //this.zombieModel = new THREE.Mesh(zombieImport.scene.geometry, zombieImport.scene.material);
        this.zombieModel = zombieImportArray[i];
        this.zombieModel.position.x = x;
        this.zombieModel.position.y = y;
        this.hitbox.position.set(this.zombieModel.position.x + 1, 5, this.zombieModel.position.z+1);
        //this.loadZombie();
        this.zombie.add(this.zombieModel);
        this.zombie.add(this.hitbox);
        this.zombie.position.set(x,2,z);
        this.direction = [];
        this.rayCaster = new THREE.Raycaster( this.zombie.position, new THREE.Vector3( 0, 0, 0 ), 0, 1 );
        //this.force = level*2;
        this.zombieHealth = 1;
        //this.originalPosition = new THREE.Vector3();
    }

    async loadZombie(){
        let gltfLoader = await import('../three.js-master/examples/jsm/loaders/GLTFLoader.js')
        let that = this;
        let loader = new gltfLoader();
        loader.load(
            '../models/zombie1.glb',
            function (zombieImport) {
                that.zombieModel = zombieImport.scene;
                that.zombie.add(that.zombieModel);
                console.log("added zombie");
            },
            function (xhr) {
                console.log('Zombie model loading: ' + (xhr.loaded/xhr.total * 100) + '%');
            },
            function (err) {
                console.error('Error loading Zombie model: ' + err);
            }
        );
    }

    addBulletListener(){
        let that = this;
        this.zombie.hitbox.addEventListener('collision', function(
            otherObject,
            velocity,
            rotation,
            normal) {
                if (velocity.dot> 500) {
                    if (performance.now() - this.hitTime > 1) {
                        that.hit();
                    }

                    otherObject.visible = false;
                }
            }
        );
    }

    getPosition(){
        return new THREE.Vector3(
            this.zombie.position.x,
            this.zombie.position.y,
            this.zombie.position.z
        );
    }

    setInitialPosition(x,y,z) {
        this.zombie.position.x = x;
        this.zombie.position.y = y;
        this.zombie.position.z = z;
        this.originalPosition.x = x;
        this.originalPosition.y = y;
        this.originalPosition.z = z;

    }

    hit(){
        this.zombieHealth--;
        this.hitTime = performance.now();
        if (this.zombieHealth === 0) {
            this.zombie.visible = false;
        }
    }

    animate()  {
        //do zombie movements here
    }
}