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
            this.writer.setUint8(player.id);
            this.writer.setString(player.name);
            this.writer.setUint16(player.score);
        });
        return this.writer.toBuffer();
    }
}