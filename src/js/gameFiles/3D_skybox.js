class Skybox{

    constructor() {
        /*
        Materials are imported and pushed to the skybox mesh
         */
        this.materialArray = [];

        this.texture_ft = new THREE.TextureLoader().load('../../src/textures/skybox2/sh_ft.png');
        this.texture_bk = new THREE.TextureLoader().load('../../src/textures/skybox2/sh_bk.png');
        this.texture_up = new THREE.TextureLoader().load('../../src/textures/skybox2/sh_up.png');
        this.texture_dn = new THREE.TextureLoader().load('../../src/textures/skybox2/sh_dn.png');
        this.texture_rt = new THREE.TextureLoader().load('../../src/textures/skybox2/sh_rt.png');
        this.texture_lf = new THREE.TextureLoader().load('../../src/textures/skybox2/sh_lf.png');

        this.materialArray.push(new THREE.MeshPhongMaterial({map: this.texture_ft}));
        this.materialArray.push(new THREE.MeshPhongMaterial({map: this.texture_bk}));
        this.materialArray.push(new THREE.MeshPhongMaterial({map: this.texture_up}));
        this.materialArray.push(new THREE.MeshPhongMaterial({map: this.texture_dn}));
        this.materialArray.push(new THREE.MeshPhongMaterial({map: this.texture_rt}));
        this.materialArray.push(new THREE.MeshPhongMaterial({map: this.texture_lf}));

        for (let i = 0 ; i < this.materialArray.length ; i++) {
            this.materialArray[i].side = THREE.BackSide;
            this.materialArray[i].frustumCulled = false;
        }

        this.skyboxGeo = new THREE.BoxGeometry(1000,1000,1000);
        this.skybox = new THREE.Mesh(this.skyboxGeo, this.materialArray);
    }

    getObject(){
        return this.skybox;
    }
}