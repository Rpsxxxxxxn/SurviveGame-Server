const BinaryWriter = require("../common/BinaryWriter");

module.exports = class UpdateLeaderboard {
    /**
     * リーダーボードの更新
     * @param {*} players 
     */
    constructor(players) {
        this.players = players;
        this.writer = new BinaryWriter();
    }

    /**
     * パケットを生成する
     * @returns 
     */
    getPacket() {
        this.writer.setUint8(0x03);
        this.writer.setUint8(this.players.length);
        this.players.forEach(player => {
            this.writer.setUint32(player.character.id);
            this.writer.setString(player.character.name);
            this.writer.setUint32(player.character.score);
        });
        return this.writer.toBuffer();
    }
}