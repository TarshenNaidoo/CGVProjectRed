class Zombie {

    constructor (scene, level, x, y, z, i) {

        this.zombie = new THREE.Object3D();
        this.zombieModel = zombieImportArray_3D[i];
        let mesh = new THREE.MeshBasicMaterial({color:0x777777});
        mesh.transparent = true;
        mesh.opacity = 0;
        this.hitbox = new Physijs.Mesh(
            new THREE.BoxBufferGeometry(
                7,10,7
            ), mesh);
        this.hitbox.position.set(this.zombieModel.position.x + 1, 5, this.zombieModel.position.z+1);
        this.zombie.add(this.zombieModel);
        this.zombie.add(this.hitbox);
        this.zombie.position.set(x*2,y,z);
        this.direction = [];
        this.rayCaster = new THREE.Raycaster( this.zombie.position, new THREE.Vector3( 0, 0, 0 ), 0, 1 );
        this.zombieHealth = level;
        this.scene = scene;
        this.hitTime = 0;
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
	    let Cam = new THREE.Vector3();
	    Cam.x = controls_3D.getObject().position.x;
	    Cam.z = controls_3D.getObject().position.z;
	    //for (let i = 0; i < zombie.children.length ; i++) {
                    let zDirection = new THREE.Vector3();

                    zDirection.x = Cam.x - zomPos.x;
		            zDirection.z = Cam.z - zomPos.z;

                    //checks if Zombie is close enough then stops moving
                    let radius = Math.sqrt(Math.pow(zDirection.x,2) + Math.pow(zDirection.z,2));
                    if (radius < 5){
                        if (performance.now() - this.hitTime > 500 && this.zombieHealth != 0){
                            this.scene.avatar.hit();
                            this.hitTime = performance.now();
                        }
                    } else {
                        zDirection.normalize();
                        this.zombie.lookAt(Cam.x, this.zombie.position.y, Cam.z);
                        let speed = 0.1;
                        this.zombie.position.x += zDirection.x * speed;
                        this.zombie.position.z += zDirection.z * speed;
                    }
        //}
    }
}
