const BinaryWriter = require("../common/BinaryWriter");

module.exports = class TrackingId {
    /**
     * トラッキングIDを送信するパケット
     * @param {*} id 
     */
    constructor(id) {
        this.id = id;
        this.writer = new BinaryWriter();
    }

    /**
     * パケットを生成する
     * @returns 
     */
    getPacket() {
        this.writer.setUint8(0x06);
        this.writer.setUint32(this.id);
        return this.writer.toBuffer();
    }
}