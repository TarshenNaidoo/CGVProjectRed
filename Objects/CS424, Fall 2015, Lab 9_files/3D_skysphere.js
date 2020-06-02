class Skysphere{

    constructor() {

        this.materialArray = [];

        this.texture_night = new THREE.TextureLoader().load("resources/night.jpg");
        this.texture_day = new THREE.TextureLoader().load("resources/day.jpg");

        this.materialArray.push(new THREE.MeshPhongMaterial({map: this.texture_night}));
        this.materialArray.push(new THREE.MeshPhongMaterial({map: this.texture_day}));

        this.skyspheregeo = new THREE.SphereGeometry( 5, 32, 32,0,3.15,0,3.15 );
        this.skyspheresouth = new THREE.Mesh(this.skyspheregeo, this.materialArray[1]);
        this.skyspherenorth = new THREE.Mesh(this.skyspheregeo, this.materialArray[0]);
        this.skyspheresouth.rotateY(Math.PI);
        this.skyspherenorth.add(this.skyspheresouth);

    }

    getObject(){
        return this.skyspherenorth;
    }
}