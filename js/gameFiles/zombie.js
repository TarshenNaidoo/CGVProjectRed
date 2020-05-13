class Zombie {

    constructor (zombie, level) {

        this.zombie = zombie;
        this.direction = [];
        this.force = level*2;
        this.zombieHealth = 1;
        this.init = true;
        this.originalPosition = new THREE.Vector3();
        this.hitTime = performance.now();
    }

    addBulletListener(){
        let that = this;
        this.zombie.addEventListener('collision', function(
            otherObject,
            velocity,
            rotation,
            normal) {
                if (performance.now() - this.hitTime > 1) {
                    that.hit();
                }
            }
        );
    }

    getPosition(){
        return new THREE.Vector3(
            this.zombie.position.x,
            this.zombie.position.y,
            this.zombie.position.z
        );
    }

    setInitialPosition(x,y,z) {
        this.zombie.position.x = x;
        this.zombie.position.y = y;
        this.zombie.position.z = z;
        this.originalPosition.x = x;
        this.originalPosition.y = y;
        this.originalPosition.z = z;

    }

    hit(){
        this.zombieHealth--;
        this.hitTime = performance.now();
        if (this.zombieHealth === 0) {
            this.zombie.visible = false;
        }
    }

    animate()  {
        //do zombie movements here
    }
}