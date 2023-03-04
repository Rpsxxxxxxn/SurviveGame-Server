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
        this.size = 5;
        this.isAlive = true;

        this.quadTreeNode = null;
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

    setVelocity(velocity) {
        this.velocity = velocity;
    }

    setDamage(damage) {
        this.damage = damage;
    }

    setSize(size) {
        this.size = size;
    }

    setAlive(isAlive) {
        this.isAlive = isAlive;
    }

    
}