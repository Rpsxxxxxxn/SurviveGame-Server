module.exports = class UpdateServerInfo {
    constructor(serverName, serverDescription, serverVersion) {
        this.serverName = serverName;
        this.serverDescription = serverDescription;
        this.serverVersion = serverVersion;
        this.writer = new BinaryWriter();
    }

    getPacket() {
        this.writer.setUint8(0x04);
        this.writer.setString(this.serverName);
        this.writer.setString(this.serverDescription);
        this.writer.setString(this.serverVersion);
        return this.writer.build();
    }
}