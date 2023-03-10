const Rectangle = require("../common/Rectangle");
const Vector2 = require("../common/Vector2");
const NodeData = require("./NodeData");

module.exports = class Bullet extends NodeData {
    /**
     * 弾のクラス
     * @param {*} parent 
     * @param {*} id 
     * @param {*} position 
     * @param {*} direction 
     * @param {*} damage 
     */
    constructor(parent, id, position, direction, damage, size) {
        super(id, 2, position, size);
        this.parent = parent; // 親クラス
        this.direction = direction; // 速度
        this.damage = damage; // ダメージ
    }

    /**
     * ダメージを設定する
     * @param {*} damage 
     */
    setDamage(damage) {
        this.damage = damage;
    }

    /**
     * 物理更新
     */
    onUpdatePhysics(border) {
        this.position.add(Vector2.fromAngle(this.direction).mulScalar(15));
        this.onUpdateAlive(border);
    }

    /**
     * 衝突判定
     * @param {*} other 
     * @returns 
     */
    onCollision(other) {
        if (other instanceof Bullet) return;
        this.gameServer.onRemoveBullet(this);
    }

    /**
     * ダメージを設定する
     * @param {*} damage 
     */
    setDamage(damage) {
        this.damage = damage;
    }

    /**
     * サイズを設定する
     * @param {*} size 
     */
    setSize(size) {
        this.size = size;
    }

    /**
     * 生存状態を設定する
     */
    setAlive(isAlive) {
        this.isAlive = isAlive;
    }

    /**
     * サイズの二乗を取得する
     * @returns 
     */
    getSquaredSize() {
        return this.size * this.size;
    }

    /**
     * 生存状態を更新する
     * @param {*} border 
     * @returns 
     */
    onUpdateAlive(border) {
        if (!this.isAlive) return;
        if (this.position.x < border.x ||
            this.position.x > border.w ||
            this.position.y < border.y ||
            this.position.y > border.h) {
            this.isAlive = false;
        }
    }

    /**
     * 衝突判定の矩形を取得する
     * @returns 
     */
    onCollisionViewBox() {
        return new Rectangle(
            this.position.x,
            this.position.y,
            this.size * 5,
            this.size * 5)
    }
}