const BinaryWriter = require("../common/BinaryWriter");

module.exports = class AddPlayer {
    /**
     * プレイヤーを追加するパケットを生成する
     * @param {*} player 
     */
    constructor(player) {
        this.player = player;
        this.writer = new BinaryWriter();
    }

    /**
     * パケットを生成する
     * @returns 
     */
    getPacket() {
        this.writer.setUint8(0x00);
        this.writer.setUint32(this.player.character.id);
        this.writer.setString(this.player.character.name);
        this.writer.setUint16(this.player.character.hp);
        this.writer.setUint16(this.player.character.str);
        this.writer.setUint16(this.player.character.dex);
        this.writer.setUint16(this.player.character.int);
        this.writer.setUint16(this.player.character.luk);
        return this.writer.toBuffer();
    }
}