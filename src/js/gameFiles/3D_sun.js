class Sun{

    constructor(x,y,z) {
        this.maxHeight = y;
        //this.object is an empty container is added to the scene ath (0,0,0) and contains the sun. As the object
        //rotates the sun object will orbit around the container preserving distance
        this.object = new THREE.Object3D();
        this.opacityLimit = 100;
        this.opacityPercent = 1;
        this.geometry = new THREE.SphereGeometry( 5, 32, 32 );
        this.material = new THREE.MeshBasicMaterial( {color: 0xf9d71c, transparent:true, opacity:0.5} );
        this.sun = new THREE.Mesh( this.geometry, this.material );
        this.pointLight = new THREE.PointLight({color:0xf9d71c, intensity:1, distance: 50, decay:2});
        this.sun.add(this.pointLight);
        this.object.add(this.sun);
        this.sun.position.set(x,y,z); //sets the sun object to a specified position from the parent container
        this.timeStep = 1/60; //percentage of a minute it takes to complete dimming/brightening cycle
        this.currentHeight = y;
        this.twilightHeight = -50;
    }

    animate(){
        this.currentHeight = this.sun.position.y * Math.cos(this.object.rotation.z);
        this.setRotation();
        this.setIntensity();
        this.setOpacity();

    }

    /*
    function offsets current height and max height by the opacity limit (point at which the sun disappears), and
    and gets the opacity as a percentage. The sun is designed to disappear at some point above the horizon so that
    the player can't approach it. Since that is unrealistic
     */
    setOpacity(){
        this.opacityPercent = (this.currentHeight-this.opacityLimit)/(this.maxHeight - this.opacityLimit);
        this.opacityPercent = Math.max(0,this.opacityPercent);
        this.sun.material.opacity = this.opacityPercent;
    }

    //Sunlight reaches total darkness at the "horizon"
    setIntensity(){
        if (this.currentHeight >= this.opacityLimit) {
            this.pointLight.intensity = Math.max(0,this.currentHeight/this.maxHeight);
        } else if (this.currentHeight >= 0){
            let intensityPercent = (this.opacityLimit - this.currentHeight)/this.opacityLimit;
            this.pointLight.intensity = Math.max(this.currentHeight/this.maxHeight,intensityPercent);
        } else {
            let tempIntensity = 1*(1-(this.currentHeight/this.twilightHeight));
            this.pointLight.intensity = Math.max(0,tempIntensity);
        }
    }

    //continuously rotates the sun
    setRotation(){
        this.object.rotation.z +=(2*Math.PI)*this.timeStep * delta_3D;
    }

    getObject(){
        return this.object;
    }

}