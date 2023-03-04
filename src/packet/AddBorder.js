const BinaryWriter = require("../common/BinaryWriter");

module.exports = class AddBorder {
    /**
     * 境界線を追加するパケットを生成する
     * @param {*} border 
     */
    constructor(border) {
        this.border = border;
        this.writer = new BinaryWriter();
    }

    /**
     * パケットを生成する
     * @returns 
     */
    getPacket() {
        this.writer.setUint8(0x08);
        this.writer.setFloat32(this.border.x);
        this.writer.setFloat32(this.border.y);
        this.writer.setFloat32(this.border.w);
        this.writer.setFloat32(this.border.h);
        return this.writer.toBuffer();
    }
}