const BinaryWriter = require("../common/BinaryWriter");

module.exports = class UpdateServerInfo {
    /**
     * サーバー情報を更新するパケットを生成する
     * @param {*} serverName 
     * @param {*} serverDescription 
     * @param {*} serverVersion 
     */
    constructor(serverName, serverDescription, serverVersion) {
        this.serverName = serverName;
        this.serverDescription = serverDescription;
        this.serverVersion = serverVersion;
        this.writer = new BinaryWriter();
    }

    /**
     * パケットを生成する
     * @returns 
     */
    getPacket() {
        this.writer.setUint8(0x04);
        this.writer.setString(this.serverName);
        this.writer.setString(this.serverDescription);
        this.writer.setString(this.serverVersion);
        return this.writer.toBuffer();
    }
}