class Sun{

    constructor(x,y,z) {
        this.maxHeight = y;
        this.object = new THREE.Object3D();
        this.opacityLimit = 100;
        this.opacityPercent = 1;
        this.geometry = new THREE.SphereGeometry( 5, 32, 32 );
        this.material = new THREE.MeshBasicMaterial( {color: 0xf9d71c, transparent:true, opacity:0.5} );
        this.sun = new THREE.Mesh( this.geometry, this.material );
        this.pointLight = new THREE.PointLight({color:0xf9d71c, intensity:1, distance: 50, decay:2});
        this.sun.add(this.pointLight)
        this.object.add(this.sun);
        this.sun.position.set(x,y,z);
        this.isDimming = true;
        this.timeStep = 1/60; //percentage of a minute it takes to complete dimming/brightening cycle
        this.currentHeight = y;

    }

    animate(){
        this.currentHeight = this.sun.position.y * Math.cos(this.object.rotation.z);
        this.alterRotation();
        this.alterIntensity();
        this.alterOpacity();

    }

    alterOpacity(){
        this.opacityPercent = (this.currentHeight-this.opacityLimit)/(this.maxHeight - this.opacityLimit);
        this.opacityPercent = Math.max(0,this.opacityPercent);
        this.sun.material.opacity = this.opacityPercent;
    }

    alterIntensity(){
        this.pointLight.intensity = Math.max(0,this.currentHeight/this.maxHeight);
        console.log (this.pointLight.intensity);
    }

    alterRotation(){
        this.object.rotation.z +=(2*Math.PI)*this.timeStep * delta_3D;
    }

    getObject(){
        return this.object;
    }

}