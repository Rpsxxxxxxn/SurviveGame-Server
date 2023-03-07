const BinaryWriter = require("../common/BinaryWriter");

module.exports = class UpdateLevel {
    /**
     * レベルを更新するパケットを生成する
     * @param {*} level 
     */
    constructor(level, experience) {
        this.level = level;
        this.experience = experience;
        this.writer = new BinaryWriter();
    }
    
    getPacket() {
        this.writer.setUint8(0x0B);
        this.writer.setUint8(this.level);
        this.writer.setUint32(this.experience);
        return this.writer.toBuffer();
    }
}