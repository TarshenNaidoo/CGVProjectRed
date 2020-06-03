class DynamicSkybox{

    constructor() {
        let geometry = new THREE.SphereGeometry(500,32,32);
        let material = new THREE.MeshStandardMaterial();

        this.skybox = new THREE.Mesh(geometry, material);

        this.skybox.material.emissive = new THREE.Color(0x0077be);
        this.skybox.material.side = THREE.BackSide;

        this.texture = new THREE.TextureLoader("bleg");
        this.texture.transparent

        //this.skybox.material.frustumCulled = false;
    }

    getObject(){
        return this.skybox;
    }

    animate(intensity){
        this.skybox.material.emissiveIntensity = Math.max(0,intensity);
    }

}