const BinaryWriter = require("../common/BinaryWriter");

module.exports = class AddPlayer {
    /**
     * プレイヤーを追加するパケットを生成する
     * @param {*} character 
     */
    constructor(character) {
        this.character = character;
        this.writer = new BinaryWriter();
    }

    /**
     * パケットを生成する
     * @returns 
     */
    getPacket() {
        this.writer.setUint8(0x00);
        this.writer.setUint32(this.character.id);
        this.writer.setUTF8String(this.character.name);
        this.writer.setUint16(this.character.hp);
        this.writer.setUint16(this.character.str);
        this.writer.setUint16(this.character.dex);
        this.writer.setUint16(this.character.int);
        this.writer.setUint16(this.character.luk);
        return this.writer.toBuffer();
    }
}