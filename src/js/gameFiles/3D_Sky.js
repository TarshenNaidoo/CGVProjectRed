class Sky{

    constructor(x,y,z, scene) {
        this.scene = scene;
        this.sky = new THREE.Object3D();
        this.timeStep = (1/60) * (1/2) ; //percentage of a minute it takes to complete dimming/brightening cycle

        /*
        sunGroup:
        is an empty container is added to the scene ath (0,0,0) and contains the sun. As the object rotates;
        the sun object will orbit around the container preserving distance from the origin of the scene.

        sunOpacityLimit:
        point at which sun becomes invisible (Is greater than 0).

        sunColorLimit:
        Should be positive and sun starts to become red between this point and the horizon.
        Color becomes reversed between the horizon and the negative of this.sunColorLimit.

        sunOpacityPercent:
        controls the opacity of the sun and is modified each frame.

        sunTwilightHeight:
        controls the height the sun continues to emit light below the horizon. Sort of like real life

        distanceMetric:
        This is the original distance between the sun and the player and will be used to scale the sun to appear the
        same size to the player no matter where they are
         */

        this.sunGroup = new THREE.Object3D();
        this.sky.add(this.sunGroup);
        this.sunMaxHeight = y;
        this.sunOpacityLimit = 100;
        this.sunColorLimit = 50;
        this.sunScaleLimit = 1.5;
        this.sunOpacityPercent = 1;
        this.sunGeometry = new THREE.SphereBufferGeometry( this.sunScaleLimit, 32, 32 );
        this.sunMaterial = new THREE.MeshStandardMaterial( {
            emissive: 0xffff00,
            emissiveIntensity: 1,
            color: 0xFFFFFF,
            transparent:true,
            opacity:0.5
        } );
        this.sun = new THREE.Mesh( this.sunGeometry, this.sunMaterial );
        this.sunPointLight = new THREE.PointLight({intensity:18000, decay:2});
        this.sunPointLight.color.b = (150/255);
        this.sunPointLight.castShadow = true;
        this.sun.add(this.sunPointLight);
        this.sunGroup.add(this.sun);
        this.sun.position.set(x,y,z);
        this.sunCurrentHeight = y;
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

        /*
        Moon stuff:
         */
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
        this.moonPower = 400;
        this.sky.add(this.moon);

        this.cloudGroup = new THREE.Object3D();
        this.cloudGroupArray = [];

        for (let i = 0 ; i < cloudNum_3D ; i++) {
            let cloudGroup = new Cloud(i);

            this.cloudGroupArray.push(cloudGroup)
            this.cloudGroup.add(cloudGroup.getObject());
        }

        this.sky.add(this.cloudGroup);

        this.fog = new Fog(this);

    }

    getFog(){
        return this.fog;
    }

    getSunLight(){
        return this.sunPointLight;
    }
    getSky(){
        return this.sky;
    }

    getSunPosition(){
        return new THREE.Vector3(
            this.getSky().position.x + this.sunGroup.position.x + this.sun.position.x,
            this.getSky().position.y + this.sunGroup.position.y + this.sun.position.y,
            this.getSky().position.z + this.sunGroup.position.z + this.sun.position.z
        );
    }

    animate(){

        this.sunCurrentHeight = this.sun.position.y * Math.cos(this.sunGroup.rotation.z);
        this.setSunRotation();
        this.setSunColor();
        this.setSunIntensity();
        this.setSunOpacity();
        this.setSunScale();

        this.setMoonIntensity();
        this.setMoonOpacity();

        this.animateCloudGroup();

        this.animateFog();


    }

    animateFog(){
        this.fog.animate();
    }

    animateCloudGroup(){
        for (let i = 0 ; i < this.cloudGroup.children.length ;i++) {
            this.cloudGroupArray[i].animate();
        }
    }

    /*
    Sets the moon light emitting power to be directly proportional to the suns height below the horizon. This increases
    until the sun's emitting light is 0.
     */
    setMoonIntensity(){
        let moonPower = 0;
        if (this.sunCurrentHeight <= 0) {
            moonPower =this.moonPower*Math.max(1, this.sunCurrentHeight/this.sunTwilightHeight);
            //console.log(moonIntensity);
        } else {
            moonPower = 0;
        }
        this.moonPointLight.power = moonPower;

    }

    /*
    The moon's opacity is set to be proportional the sun's height. The moon is completely opaque when the sun is above
    the first threshold, starts to fade as the sun crosses the first threshold, fades further when the sun crosses the
    horizon, and becomes completely transparent after the second threshold. This process is reversed when the sun
    starts to rise again
     */

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

    /*
    This function gets the sun's current distance between itself and the player and divides it by the original distance
    calculated in the constructor. This scales the sun up if the player has moved a net distance away or scaled down if
    the player has moved a net distance towards the sun.
     */

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

    /*
    The sun's green value will be scaled down from full to 0.4 (102 rgb value), and the blue from rgb value of 150 to
    0. This changes the sky to a bright yellowish color to red-oranges color.
     */
    setSunColor(){
        if (Math.abs(this.sunCurrentHeight) < this.sunColorLimit){
            let colorModifier = Math.abs(this.sunCurrentHeight/this.sunColorLimit);
            if (colorModifier > 1) {colorModifier = 1;}
            this.sunPointLight.color.r = 1;
            //this.sunPointLight.color.g = Math.max(0.4,1*colorModifier);
            this.sunPointLight.color.g = 0.4 + colorModifier * 0.6;
            this.sunPointLight.color.b = (150/255)*colorModifier;
        }
    }

    //Sunlight reaches total darkness at the "horizon"
    setSunIntensity(){

        if (this.sunCurrentHeight >= this.sunTwilightHeight) {
            this.sunPointLight.power = 18000 * ((this.sunCurrentHeight+Math.abs(this.sunTwilightHeight))/(this.sunMaxHeight+Math.abs(this.sunTwilightHeight)));
        } else {
            this.sunPointLight.intensity = 0;
        }

    }

    //continuously rotates the sun
    setSunRotation(){
        this.sunGroup.rotation.z +=(2*Math.PI)*this.timeStep * delta_3D;
    }

}