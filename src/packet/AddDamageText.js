module.exports = class AddDamageText {
    /**
     * ダメージテキストを追加するパケットを生成する
     * @param {*} damageText 
     */
    constructor(damageText) {
        this.damageText = damageText;
        this.writer = new BinaryWriter();
    }

    getPacket() {
        this.writer.setUint8(0x09); // パケットID
        this.writer.setFloat32(this.damageText.x); // ダメージテキストの位置
        this.writer.setFloat32(this.damageText.y); // ダメージテキストの位置
        this.writer.setUint32(this.damageText.damage); // ダメージ

        const damageTextColor = this.damageText.getColorToRGB();
        this.writer.setUint8(damageTextColor.r); // 赤
        this.writer.setUint8(damageTextColor.g); // 緑
        this.writer.setUint8(damageTextColor.b); // 青
        return this.writer.toBuffer();
    }
}