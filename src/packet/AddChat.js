const BinaryWriter = require("../common/BinaryWriter");
const Utils = require("../common/Utils");

module.exports = class AddChat {
    /**
     * チャットを追加するパケットを生成する
     * @param {*} sender 
     * @param {*} message 
     */
    constructor(sender, message) {
        this.sender = sender;
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
        if (Utils.isNotEmpty(this.sender)) {
            this.writer.setUint32(this.sender.character.id);
            this.writer.setString(this.sender.character.name);
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