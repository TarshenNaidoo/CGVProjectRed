class Map{

    constructor() {
        //this.camera = new THREE.OrthographicCamera(window.innerWidth/-2,window.innerWidth/2, window.innerHeight/-2, window.innerHeight/2, 0.1,1000);
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1,1000);
        //this.camera.position.x = this.scene.getAvatarPosition().x;
        //this.camera.position.y = this.scene.getAvatarPosition().y + 100;
        //this.camera.position.z = this.scene.getAvatarPosition().z;

        //this.camera.lookAt(this.scene.avatar.getAvatarPosition());

    }

    setPosition(position){
        this.camera.position.x = position.x;
        this.camera.position.y = position.y + 100;
        this.camera.position.z = position.z;
        this.camera.rotation.set(-Math.PI/2,0,0);
    }

    getObject(){
        return this.camera;
    }

    animate(position){
        this.setPosition(position);
    }
}