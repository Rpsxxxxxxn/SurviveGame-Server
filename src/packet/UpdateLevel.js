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
    
    /**
     * パケットを生成する
     * @returns 
     */
    getPacket() {
        this.writer.setUint8(0x0B);
        this.writer.setUint16(this.level); // レベル
        this.writer.setUint32(this.experience); // 経験値
        return this.writer.toBuffer();
    }
}