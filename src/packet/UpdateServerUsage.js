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
        this.writer.setFloat32(this.cpuUsage); // CPUの使用率
        this.writer.setFloat32(this.ramUsage); // RAMの使用率
        this.writer.setFloat32(this.deltaTime); // フレームの時間
        this.writer.setFloat32(this.framerate); // フレームレート
        return this.writer.toBuffer();
    }
}