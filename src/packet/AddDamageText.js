const BinaryWriter = require("../common/BinaryWriter");

module.exports = class AddDamageText {
    /**
     * ダメージテキストを追加するパケットを生成する
     * @param {*} damageText 
     */
    constructor(damageText) {
        this.damageText = damageText;
        this.writer = new BinaryWriter();
    }

    /**
     * パケットを生成する
     * @returns 
     */
    getPacket() {
        this.writer.setUint8(0x09); // パケットID
        this.writer.setFloat32(this.damageText.position.x); // ダメージテキストの位置
        this.writer.setFloat32(this.damageText.position.y); // ダメージテキストの位置
        this.writer.setString(this.damageText.text); // ダメージ

        const damageTextColor = this.damageText.getColorToRGB();
        this.writer.setUint8(damageTextColor.r); // 赤
        this.writer.setUint8(damageTextColor.g); // 緑
        this.writer.setUint8(damageTextColor.b); // 青
        return this.writer.toBuffer();
    }
}