const BinaryWriter = require("../common/BinaryWriter");

module.exports = class AddPlayers {
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
        this.writer.setUint32(player.id);
        this.writer.setString(player.name);
        this.writer.setUint16(player.hp);
        this.writer.setUint16(player.str);
        this.writer.setUint16(player.dex);
        this.writer.setUint16(player.int);
        this.writer.setUint16(player.luk);
        return this.writer.build();
    }
}