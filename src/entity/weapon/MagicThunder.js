const Vector2 = require("../../common/Vector2");
const NodeData = require("../NodeData");

module.exports = class MagicThunder extends NodeData {
    constructor(id, x, y, size) {
        super(id, 2, new Vector2(x, y), size);
    }

    /**
     * 
     */
    onUpdatePhysics(border) {

        this.onUpdateAlive(border);
    }

    /**
     * 生存状態を更新する
     * @param {*} border 
     * @returns 
     */
    onUpdateAlive(border) {
        if (!this.isAlive) {
            return;
        }
        if (this.position.x < border.x ||
            this.position.x > border.w ||
            this.position.y < border.y ||
            this.position.y > border.h) {
            this.isAlive = false;
        }
    }
}