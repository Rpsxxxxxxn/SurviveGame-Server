module.exports = class UpdateServerUsage {
    /**
     * CPUとRAMの使用率を送信するパケット
     * @param {*} cpuUsage 
     * @param {*} ramUsage 
     */
    constructor(cpuUsage, ramUsage) {
        this.cpuUsage = cpuUsage;
        this.ramUsage = ramUsage;
        this.writer = new BinaryWriter();
    }

    /**
     * パケットを生成する
     * @returns 
     */
    getPacket() {
        this.writer.setUint8(0x05);
        this.writer.setUint8(this.cpuUsage);
        this.writer.setUint8(this.ramUsage);
        return this.writer.toBuffer();
    }
}