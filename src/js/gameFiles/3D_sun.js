class Sun{

    constructor(x,y,z) {
        this.maxHeight = y;
        //this.object is an empty container is added to the scene ath (0,0,0) and contains the sun. As the object
        //rotates the sun object will orbit around the container preserving distance
        this.object = new THREE.Object3D();
        this.sunOpacityLimit = 100; //point at which sun becomes invisible (Is greater than 0)
        /*
        this.sunColorLimit. Should be positive and sun starts to become red between this point and the horizon.
        Color becomes reversed between the horizon and the negative of this.sunColorLimit.
         */
        this.sunColorLimit = 50;
        this.sunOpacityPercent = 1; //controls the opacity of the sun and is modified each frame
        this.sunGeometry = new THREE.SphereGeometry( 5, 32, 32 );
        this.sunMaterial = new THREE.MeshBasicMaterial( {color:0xffff00, transparent:true, opacity:0.5} );
        this.sun = new THREE.Mesh( this.sunGeometry, this.sunMaterial );
        this.sunPointLight = new THREE.PointLight({intensity:1, distance: 50, decay:2});
        this.sunPointLight.color.b = (150/255);
        this.sun.add(this.sunPointLight);
        this.object.add(this.sun);
        this.sun.position.set(x,y,z); //sets the sun object to a specified position from the parent container
        this.timeStep = (1/60) * (1/2) ; //percentage of a minute it takes to complete dimming/brightening cycle
        this.sunCurrentHeight = y;
        /*
        this.sunTwilightHeight controls the height the sun continues to emit light below the horizon. Sort of like real
        life
         */
        this.sunTwilightHeight = -50;
        this.sun.castShadow = false;
        this.sun.receiveShadow = false;
        this.sunPointLight.castShadow = true;

        this.moonMesh = new THREE.SphereGeometry( 5, 32, 32 );
        this.moonMaterial = new THREE.MeshBasicMaterial({color:0xc2c5cc, transparent:true});
        this.moon = new THREE.Mesh(this.moonMesh, this.moonMaterial);
        this.moonPointLight = new THREE.PointLight({color:0xc2c5cc, intensity:0, distance:50, decay:2});
        this.moon.add(this.moonPointLight);
        this.moon.receiveShadow = false;
        this.moon.castShadow = false;
        this.moon.position.set(0,250,400);

        this.sky = new THREE.Object3D();
        this.sky.add(this.object);
        this.sky.add(this.moon);

    }

    animate(){

        this.sunCurrentHeight = this.sun.position.y * Math.cos(this.object.rotation.z);
        this.setSunRotation();
        this.setSunColor();
        this.setSunIntensity();
        this.setSunOpacity();

        this.setMoonIntensity();
        this.setMoonOpacity();


    }

    setMoonIntensity(){
        let moonIntensity = 0;
        if (this.sunCurrentHeight <= 0) {
            moonIntensity = Math.min(1, this.sunCurrentHeight/this.sunTwilightHeight);
            moonIntensity *= 0.15;
            console.log(moonIntensity);
        }
        this.moonPointLight.intensity = moonIntensity;

    }

    setMoonOpacity(){
        let moonOpacity = 0;
        if (this.sunCurrentHeight <= 0) {
            moonOpacity = this.sunCurrentHeight/this.sunTwilightHeight;
            moonOpacity *= 0.15;
            moonOpacity = Math.min(1,);
        }
        this.moonMaterial.opacity = moonOpacity;
    }

    /*
    function offsets current height and max height by the opacity limit (point at which the sun disappears), and
    and gets the opacity as a percentage. The sun is designed to disappear at some point above the horizon so that
    the player can't approach it. Since that is unrealistic
     */
    setSunOpacity(){
        this.sunOpacityPercent = (this.sunCurrentHeight-this.sunOpacityLimit)/(this.maxHeight - this.sunOpacityLimit);
        this.sunOpacityPercent = Math.max(0,this.sunOpacityPercent);
        this.sunMaterial.opacity = this.sunOpacityPercent;
    }

    setSunColor(){
        if (Math.abs(this.sunCurrentHeight) < this.sunColorLimit){
            let colorModifier = Math.abs(this.sunCurrentHeight/this.sunColorLimit);
            if (colorModifier > 1) {colorModifier = 1;}
            this.sunPointLight.color.r = 1;
            this.sunPointLight.color.g = Math.max(0.4,1*colorModifier);
            this.sunPointLight.color.b = (150/255)*colorModifier;
        }
    }

    //Sunlight reaches total darkness at the "horizon"
    setSunIntensity(){
        if (this.sunCurrentHeight >= this.sunOpacityLimit) {
            this.sunPointLight.intensity = this.sunCurrentHeight/this.maxHeight;
        } else if (this.sunCurrentHeight >= 0){//will run when the sun is setting
            let intensityPercent = (this.sunOpacityLimit - this.sunCurrentHeight)/this.sunOpacityLimit;
            this.sunPointLight.intensity = Math.max(this.sunCurrentHeight/this.maxHeight,intensityPercent);
        } else {
            let tempIntensity = 1*(1-(this.sunCurrentHeight/this.sunTwilightHeight));
            this.sunPointLight.intensity = Math.max(0,tempIntensity);
        }
    }

    //continuously rotates the sun
    setSunRotation(){
        this.object.rotation.z +=(2*Math.PI)*this.timeStep * delta_3D;
    }

    getObject(){
        return this.sky;
    }

}