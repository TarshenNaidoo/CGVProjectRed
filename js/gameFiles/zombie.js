class Zombie {

    constructor (zombie, level) {

        this.zombie = zombie;
        this.direction = [];
        this.force = level*2;
        this.zombieHealth = 1;
        this.init = true;
        this.originalPosition = new Vector3(
            this.zombies.x,
            this.zombies.y,
            this.zombies.z
        );
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