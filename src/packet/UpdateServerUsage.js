module.exports = class UpdateServerUsage {
    constructor(cpuUsage, ramUsage) {
        this.cpuUsage = cpuUsage;
        this.ramUsage = ramUsage;
        this.writer = new BinaryWriter();
    }

    getPacket() {
        this.writer.setUint8(0x05);
        this.writer.setUint8(this.cpuUsage);
        this.writer.setUint8(this.ramUsage);
        return this.writer.toBuffer();
    }
}