const Utils = require("../../common/Utils");
const Vector2 = require("../../common/Vector2");
const NodeData = require("../NodeData");

module.exports = class RotateDiffencer extends NodeData {
    /**
     * コンストラクタ
     * @param {*} id 
     * @param {*} x 
     * @param {*} y 
     * @param {*} size 
     */
    constructor(id, x, y, size) {
        super(id, 2, new Vector2(x, y), size);
        this.rotate = 0;
    }

    /**
     * 位置の設定
     * @param {*} position 
     */
    setPosition(position) {
        this.position = position;
    }

    /**
     * 更新処理
     */
    onUpdatePhysics(border) {
        this.rotate = (this.rotate + 1) % 360;
        this.position.x += Math.cos(Utils.degreeToRadian(this.rotate)) * 10;
        this.position.y += Math.sin(Utils.degreeToRadian(this.rotate)) * 10;
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