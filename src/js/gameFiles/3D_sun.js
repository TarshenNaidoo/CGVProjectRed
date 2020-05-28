class Sun{

    constructor(x,y,z, scene) {
        this.scene = scene;
        this.sunMaxHeight = y;

        this.sky = new THREE.Object3D();
        //this.object is an empty container is added to the scene ath (0,0,0) and contains the sun. As the object
        //rotates the sun object will orbit around the container preserving distance
        this.object = new THREE.Object3D();
        this.sky.add(this.object);
        this.sunOpacityLimit = 100; //point at which sun becomes invisible (Is greater than 0)
        /*
        this.sunColorLimit. Should be positive and sun starts to become red between this point and the horizon.
        Color becomes reversed between the horizon and the negative of this.sunColorLimit.
         */
        this.sunColorLimit = 50;
        this.sunScaleLimit = 1.5;
        this.sunOpacityPercent = 1; //controls the opacity of the sun and is modified each frame
        this.sunGeometry = new THREE.SphereBufferGeometry( this.sunScaleLimit, 32, 32 );
        this.sunMaterial = new THREE.MeshStandardMaterial( {
            emissive: 0xffff00,
            emissiveIntensity: 1,
            color: 0xFFFFFF,
            transparent:true,
            opacity:0.5
        } );
        this.sun = new THREE.Mesh( this.sunGeometry, this.sunMaterial );
        this.sunPointLight = new THREE.PointLight({intensity:1, decay:2});
        this.sunPointLight.color.b = (150/255);
        this.sunPointLight.castShadow = true;
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
        let playerPosition = controls_3D.getObject().position;
        let sunPosition = this.getSunPosition();
        this.distanceMetric = Math.sqrt(
            Math.pow(playerPosition.x + sunPosition.x,2)+
            Math.pow(playerPosition.y + sunPosition.y,2)+
            Math.pow(playerPosition.z + sunPosition.z,2)
        );

        this.moonMesh = new THREE.SphereBufferGeometry( 5, 32, 32 );
        this.moonMaterial = new THREE.MeshStandardMaterial({
            emissive: 0xc2c5cc,
            emissiveIntensity: 1,
            color:0xFFFFFF,
            transparent:true
        });
        this.moon = new THREE.Mesh(this.moonMesh, this.moonMaterial);
        this.moonPointLight = new THREE.PointLight({decay:2});
        this.moon.add(this.moonPointLight);
        this.moon.receiveShadow = false;
        this.moon.castShadow = true;
        this.moon.position.set(0,y,0);
        this.sky.add(this.moon);

    }

    getSky(){
        return this.sky;
    }

    getSunPosition(){
        return new THREE.Vector3(
            this.getSky().position.x + this.object.position.x + this.sun.position.x,
            this.getSky().position.y + this.object.position.y + this.sun.position.y,
            this.getSky().position.z + this.object.position.z + this.sun.position.z
        );
    }

    animate(){

        this.sunCurrentHeight = this.sun.position.y * Math.cos(this.object.rotation.z);
        this.setSunRotation();
        this.setSunColor();
        this.setSunIntensity();
        this.setSunOpacity();
        this.setSunScale();

        this.setMoonIntensity();
        this.setMoonOpacity();


    }

    setMoonIntensity(){
        let moonPower = 0;
        if (this.sunCurrentHeight <= 0) {
            moonPower = 400*Math.max(1, this.sunCurrentHeight/this.sunTwilightHeight);
            //console.log(moonIntensity);
        } else {
            moonPower = 0;
        }
        this.moonPointLight.power = moonPower;

    }

    setMoonOpacity(){
        let moonOpacity = null;
        if (this.sunCurrentHeight > this.sunOpacityLimit/2) {
            moonOpacity = 0;
        } else if (this.sunCurrentHeight < this.sunTwilightHeight) {
            moonOpacity = 1;
        } else if (this.sunCurrentHeight > 0){
            let th = Math.abs(this.sunTwilightHeight);
            let ch = this.sunCurrentHeight;
            let oh = this.sunOpacityLimit/2;
            moonOpacity = 1 - (ch + th)/(oh + th);
        } else {
            let th = Math.abs(this.sunTwilightHeight);
            let ch = Math.abs(this.sunCurrentHeight);
            let oh = this.sunOpacityLimit/2;
            moonOpacity = (ch + oh)/(th + oh);
        }

        this.moon.material.opacity = moonOpacity;
    }

    setSunScale(){
        let curDistance = Math.sqrt(
            Math.pow(this.getSunPosition().x + controls_3D.getObject().position.x,2)+
            Math.pow(this.getSunPosition().y + controls_3D.getObject().position.y,2)+
            Math.pow(this.getSunPosition().z + controls_3D.getObject().position.z,2)
        );
        let scale = this.sunScaleLimit *(curDistance/this.distanceMetric);
        this.sun.scale.set(scale,scale,scale);
    }

    /*
    function offsets current height and max height by the opacity limit (point at which the sun disappears), and
    and gets the opacity as a percentage. The sun is designed to disappear at some point above the horizon so that
    the player can't approach it. Since that is unrealistic
     */
    setSunOpacity(){
        this.sunOpacityPercent = (this.sunCurrentHeight-this.sunOpacityLimit)/(this.sunMaxHeight - this.sunOpacityLimit);
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
        /*

       old method of dynamically adjusting light will make the sunset brighter
        if (this.sunCurrentHeight >= this.sunOpacityLimit) {
            this.sunPointLight.power = 18000 * ((this.sunCurrentHeight-this.sunOpacityLimit)/(this.sunMaxHeight-this.sunOpacityLimit));
            console.log(this.sunPointLight.power);
        } else if (this.sunCurrentHeight >= 0){//will run when the sun is setting
            let intensityPercent = 18000 * ((this.sunOpacityLimit - this.sunCurrentHeight)/this.sunOpacityLimit);
            this.sunPointLight.power = Math.max(this.sunCurrentHeight/this.maxHeight,intensityPercent);
        } else {
            let tempIntensity = 1*(1-(this.sunCurrentHeight/this.sunTwilightHeight));
            this.sunPointLight.intensity = Math.max(0,tempIntensity);
        }

         */

        if (this.sunCurrentHeight >= this.sunTwilightHeight) {
            this.sunPointLight.power = 18000 * ((this.sunCurrentHeight+Math.abs(this.sunTwilightHeight))/(this.sunMaxHeight+Math.abs(this.sunTwilightHeight)));
        } else {
            //let tempPower = 1000*(1-(this.sunCurrentHeight/this.sunTwilightHeight));
            this.sunPointLight.intensity = 0;//Math.max(0,tempPower);
        }

    }

    //continuously rotates the sun
    setSunRotation(){
        this.object.rotation.z +=(2*Math.PI)*this.timeStep * delta_3D;
    }

}