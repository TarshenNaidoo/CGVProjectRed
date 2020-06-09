class Fog{

    /*
    This creates the fog and modulates the color according to sun position
     */
    constructor(sky) {
        this.sky = sky
        this.scene = this.sky.scene;
        this.sunPointLight = this.sky.sunPointLight
        this.sunCurrentHeight = this.sky.sunCurrentHeight;
        this.sunTwilightHeight=  this.sky.sunTwilightHeight;
        this.fogColor = this.sunPointLight.color.getHex();
        this.fog = new THREE.FogExp2(this.fogColor,0.001);
        this.fog = new THREE.FogExp2(this.fogColor,0.001);
    }

    getFog(){
        return this.fog;
    }

    animate(){
        this.setFogColor();
        this.setFogBounds();
    }

    setFogBounds(){
        let density = 0.001;
        let mod = 500;
        this.sunCurrentHeight = this.sky.sunCurrentHeight;
        this.sunTwilightHeight = this.sky.sunTwilightHeight;
        if (this.sunCurrentHeight < 0 && this.sunCurrentHeight > this.sunTwilightHeight){
            density = 0.001 - (this.sunCurrentHeight/this.sunTwilightHeight)/1000;
        } else if (this.sunCurrentHeight < 0){
            density = 0;
        }
        this.fog.density = density;

    }

    setFogColor(){
        this.fogColor = this.sunPointLight.color.getHex();
        this.fog.color.setHex(this.fogColor);
    }
}