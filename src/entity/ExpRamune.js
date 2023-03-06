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
        this.isAlive = true; // 生存状態
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

    onPhysicsUpdate(border) {
        if (this.position.x < 0 || this.position.x > border.x || this.position.y < 0 || this.position.y > border.y) {
            this.isAlive = false;
        }
    }
}