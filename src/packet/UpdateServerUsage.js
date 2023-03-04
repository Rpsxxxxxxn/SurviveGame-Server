const BinaryWriter = require("../common/BinaryWriter");

module.exports = class UpdateServerUsage {
    /**
     * CPUとRAMの使用率を送信するパケット
     * @param {*} cpuUsage 
     * @param {*} ramUsage 
     */
    constructor(cpuUsage, ramUsage, deltaTime, framerate) {
        this.cpuUsage = cpuUsage;
        this.ramUsage = ramUsage;
        this.deltaTime = deltaTime;
        this.framerate = framerate;
        this.writer = new BinaryWriter();
    }

    /**
     * パケットを生成する
     * @returns 
     */
    getPacket() {
        this.writer.setUint8(0x05);
        this.writer.setFloat32(this.cpuUsage);
        this.writer.setFloat32(this.ramUsage);
        this.writer.setFloat32(this.deltaTime);
        this.writer.setFloat32(this.framerate);
        return this.writer.toBuffer();
    }
}