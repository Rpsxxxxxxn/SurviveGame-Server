const BinaryWriter = require("../common/BinaryWriter");

module.exports = class UpdatePlayers {
    /**
     * プレイヤーデータの更新
     * @param {*} players 
     */
    constructor(players) {
        this.players = players;
        this.writer = new BinaryWriter();
    }

    /**
     * パケットの更新
     * @returns 
     */
    getPacket() {
        this.writer.setUint8(0x01);
        this.writer.setUint8(this.players.length);
        this.players.forEach(player => {
            this.writer.setUint32(player.character.id);
            this.writer.setFloat32(player.character.position.x);
            this.writer.setFloat32(player.character.position.y);
        });
        return this.writer.toBuffer();
    }
}