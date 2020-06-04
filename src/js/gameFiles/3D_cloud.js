class Cloud {

    constructor(i) {
        this.cloudGroup = new THREE.Object3D();
        this.initialX = Math.floor(Math.random()*200+50);
        this.initialY = Math.floor(Math.random()*400+70);
        this.initialZ = Math.floor(Math.random()*200+50);
        this.cloud = cloudArray_3D[i][0];
        this.cloud.position.set(this.initialX,this.initialY,this.initialZ);
        this.mixer = cloudArray_3D[i][1];
        this.AnimationClips = cloudArray_3D[i][2];
        this.cloud1Clip = THREE.AnimationClip.findByName(this.AnimationClips, 'UpDown');
        this.cloud1Animation = this.mixer.clipAction(this.cloud1Clip);
        this.cloud1Animation.play();
        this.cloud3Clip = THREE.AnimationClip.findByName(this.AnimationClips, 'Sphere.001Action');
        this.cloud3Animation = this.mixer.clipAction(this.cloud3Clip);
        this.cloud3Animation.play();

        this.cloudSpeed = 0.1;

        this.cloudGroup.add(this.cloud);
    }

    getObject(){
        return this.cloudGroup;
    }

    rotate(){
        this.cloudGroup.rotation.y += delta_3D * this.cloudSpeed;
        this.cloud.rotation.y += delta_3D * this.cloudSpeed;
    }

    animate(){
        this.rotate();

        this.mixer.update(delta_3D);
    }
}