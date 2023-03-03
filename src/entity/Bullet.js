module.exports = class Bullet {
    /**
     * 弾のクラス
     * @param {*} parent 
     * @param {*} id 
     * @param {*} position 
     * @param {*} velocity 
     * @param {*} damage 
     */
    constructor(parent, id, position, velocity, damage) {
        this.parent = parent;
        this.id = id;
        this.position = position;
        this.velocity = velocity;
        this.damage = damage;
    }

    update() {
        this.position.add(this.velocity);
    }

    physicsUpdate() {
        this.update();
    }

    onCollision(other) {
        if (other instanceof Bullet) return;
        this.gameServer.removeBullet(this);
    }


    boomerang(direction) {
        this.velocity = direction;
        
    }
}