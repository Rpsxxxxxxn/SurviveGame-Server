const BinaryWriter = require("../common/BinaryWriter");
const Utils = require("../common/Utils");

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
        // プレイヤーがいる場合はプレイヤーの情報を送信する
        if (Utils.isNotNullOrEmpty(this.player)) {
            this.writer.setUint32(this.player.character.id);
            this.writer.setString(this.player.character.name);
            this.writer.setString(this.message);
        } else {
            // プレイヤーがいない場合はサーバーからのメッセージとして送信する
            this.writer.setUint32(0);
            this.writer.setString("Server");
            this.writer.setString(this.message);
        }
        return this.writer.toBuffer();
    }
}