const Vector2 = require("../common/Vector2");

module.exports = class Bullet {
    /**
     * 弾のクラス
     * @param {*} parent 
     * @param {*} id 
     * @param {*} position 
     * @param {*} direction 
     * @param {*} damage 
     */
    constructor(parent, type, id, position, direction, damage) {
        this.parent = parent; // 親
        this.type = type; // 0: プレイヤー, 1: 敵 
        this.id = id; // ID
        this.position = position; // 位置
        this.direction = direction; // 速度
        this.damage = damage; // ダメージ
        this.size = 5; // サイズ
        this.isAlive = true; // 生存状態

        this.quadTreeNode = null; // 4分木のノード
    }

    /**
     * 物理更新
     */
    onPhysicsUpdate(border) {
        this.position.add(Vector2.fromAngle(this.direction).mulScalar(10));
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

    onUpdateAlive(border) {
        if (!this.isAlive) return;
        if (this.position.x < border.x ||
            this.position.x > border.w ||
            this.position.y < border.y ||
            this.position.y > border.h) {
            this.isAlive = false;
        }
    }

    
}