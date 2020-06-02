class Skysphere{

    constructor() {

        this.textureURLs = [
            "/CGVProjectRed/src/textures/skybox/day.jpg",
            "/CGVProjectRed/src/textures/skybox/night.jpg",];

        this.materials = [];
        for (let i = 0; i < 2; i++) {
            this.texture = new THREE.TextureLoader().load( this.textureURLs[i] );
            this.materials.push( new THREE.MeshPhongMaterial( {
                color: "white",
                side: THREE.DoubleSide,
                map: this.texture } ) );
        }

        this.skyspheregeo = new THREE.SphereGeometry( 30, 32, 32,0,3.15,0,3.15 );
        this.skyspheresouth = new THREE.Mesh(this.skyspheregeo, this.materials[0]);
        this.skyspherenorth = new THREE.Mesh(this.skyspheregeo, this.materials[1]);
        this.skyspheresouth.rotateY(Math.PI);
        this.skyspherenorth.add(this.skyspheresouth);

    }

    getObject(){
        return this.skyspherenorth;
    }
}