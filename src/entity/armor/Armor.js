module.exports = class Armor {
    constructor() {
        this.hp = 100; // 体力
        this.str = 10; // 物理攻撃力
        this.vit = 5; // 防御力
        this.dex = 1; // 攻撃速度
        this.int = 1; // 魔法攻撃力
        this.luk = 0.1; // クリティカル率
        this.spd = 1; // 移動速度
    }
}