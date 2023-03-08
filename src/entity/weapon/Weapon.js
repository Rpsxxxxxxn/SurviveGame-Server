const NodeData = require("../NodeData");
const Vector2 = require("../../common/Vector2");

module.exports = class Weapon extends NodeData {
    constructor(type, str, dex, int, luk, spd) {
        super();
        this.type = type; // 武器の種類
        this.str = str; // 物理攻撃力
        this.dex = dex; // 攻撃速度
        this.int = int; // 魔法攻撃力
        this.luk = luk; // クリティカル率
        this.spd = spd; // 移動速度
    }

    onUpdatePhysics() {}
}