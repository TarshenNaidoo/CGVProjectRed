class Zombie {

    constructor (camera, level, x, y, z, i) {

        this.zombie = new THREE.Object3D();
        this.zombieModel = zombieImportArray[i];
        let mesh = new THREE.MeshBasicMaterial({color:0x777777});
        mesh.transparent = true;
        mesh.opacity = 0.25;
        this.hitbox = new Physijs.Mesh(
            new THREE.BoxBufferGeometry(
                7,10,7
            ), mesh);
        this.hitbox.position.set(this.zombieModel.position.x + 1, 5, this.zombieModel.position.z+1);
        this.zombie.add(this.zombieModel);
        this.zombie.add(this.hitbox);
        this.zombie.position.set(x*2,2,z);
        this.direction = [];
        this.rayCaster = new THREE.Raycaster( this.zombie.position, new THREE.Vector3( 0, 0, 0 ), 0, 1 );
        this.zombieHealth = level;
        this.camera = camera;
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
                    console.log("le hit");
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

    hit(){
        this.zombieHealth--;
        this.hitTime = performance.now();
        if (this.zombieHealth === 0) {
            this.zombie.visible = false;
        }
    }

    animate()  {
        //do zombie movements here
        let zomPos = new THREE.Vector3(
            this.zombie.position.x,
            this.zombie.position.y,
            this.zombie.position.z
        );
	    let avatar = new Avatar(this);
        let playerPos = avatar.getPosition();
	    let Cam = new THREE.Vector3();
	    Cam.x = this.camera.position.x;
	    Cam.z = this.camera.position.z;
	    //for (let i = 0; i < zombie.children.length ; i++) {
                    let zDirection = new THREE.Vector3();

                    zDirection.x = Cam.x - zomPos.x;
		            zDirection.z = Cam.z - zomPos.z;

                    //checks if Zombie is close enough then stops moving
                    let radius = Math.sqrt(Math.pow(zDirection.x,2) + Math.pow(zDirection.z,2));
                    if (radius < 5){
			            avatar.hp = 0;
                        return;
                    }
                    //
                    zDirection.normalize();
                    this.zombie.lookAt(Cam.x, this.zombie.position.y, Cam.z);

                    let speed = 0.1;
                    this.zombie.position.x += zDirection.x * speed;
                    this.zombie.position.z += zDirection.z * speed;
        //}
    }
}
