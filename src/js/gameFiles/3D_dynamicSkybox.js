class DynamicSkybox{

    constructor() {
        let geometry = new THREE.SphereGeometry(867,32,32);
        let material = new THREE.MeshStandardMaterial();

        this.skybox = new THREE.Mesh(geometry, material);

        this.skybox.material.emissive = new THREE.Color(0x00315E);
        this.skybox.material.side = THREE.BackSide;

        this.texture = new THREE.TextureLoader("bleq");
        this.texture.transparent

    }

    getObject(){
        return this.skybox;
    }

    animate(intensity){
        /*
        Changes the intensity of the skybox
         */
        this.skybox.material.emissiveIntensity = Math.max(0,intensity);
    }

}