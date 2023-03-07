const Rectangle = require("../common/Rectangle");
const Vector2 = require("../common/Vector2");
const NodeData = require("./NodeData");

module.exports = class ExpRamune extends NodeData {
    /**
     * 経験値の回復アイテム
     * @param {*} id 
     * @param {*} x 
     * @param {*} y 
     * @param {*} size 
     * @param {*} exp 
     */
    constructor(id, x, y, size, exp) {
        super(id, 3, new Vector2(x, y), size);
        this.exp = exp; // 経験値
    }

    /**
     * 移動する
     * @param {*} direction 
     */
    directionMove(direction) {
        this.position.x += Math.cos(direction) * 1;
        this.position.y += Math.sin(direction) * 1;
    }

    /**
     * 目標に向かって移動する
     * @param {*} target 
     * @returns 
     */
    trackingMove(target) {
        const distance = this.position.distance(target.position);
        if (distance < 1) return;
        this.directionMove(this.position.direction(target.position));
    }

    /**
     * フレーム更新
     * @param {*} border 
     */
    onUpdatePhysics(border) {
        if (this.position.x < border.x ||
            this.position.x > border.w ||
            this.position.y < border.y ||
            this.position.y > border.h) {
                console.log("ExpRamune is out of border");
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
            this.size * 4,
            this.size * 4)
    }
}