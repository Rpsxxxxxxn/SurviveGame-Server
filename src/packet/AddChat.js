const BinaryWriter = require("../common/BinaryWriter");

module.exports = class AddChat {
    /**
     * チャットを追加するパケットを生成する
     * @param {*} sender 
     * @param {*} message 
     */
    constructor(sender, message) {
        this.player = sender;
        this.message = message;
        this.writer = new BinaryWriter();
    }

    /**
     * パケットを生成する
     * @returns 
     */
    getPacket() {
        this.writer.setUint8(0x02);
        this.writer.setUint32(this.player.id);
        this.writer.setString(this.player.name);
        this.writer.setString(this.message);
        return this.writer.toBuffer();
    }
}