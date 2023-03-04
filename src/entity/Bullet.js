const Vector2 = require("../common/Vector2");

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
        // console.log(this.position)
        this.position.add(Vector2.fromAngle(this.velocity).mulScalar(10));
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

    getSquaredSize() {
        return this.size * this.size;
    }

    
}