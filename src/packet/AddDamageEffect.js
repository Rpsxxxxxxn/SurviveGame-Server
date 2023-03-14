const BinaryWriter = require("../common/BinaryWriter");

module.exports = class AddDamageEffect {
    /**
     * ダメージを追加するパケットを生成する
     * @param {*} damage 
     */
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.writer = new BinaryWriter();
    }

    /**
     * パケットを生成する
     */
    getPacket() {
        this.writer.setUint8(0x0C);
        this.writer.setUint8(this.type);
        this.writer.setFloat32(this.x);
        this.writer.setFloat32(this.y);
        return this.writer.toBuffer();
    }
}
