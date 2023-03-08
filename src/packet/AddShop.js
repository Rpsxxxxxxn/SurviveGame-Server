const BinaryWriter = require("../common/BinaryWriter");

module.exports = class AddShop {
    /**
     * ショップを追加するパケットを生成する
     * @param {*} shoplist 
     */
    constructor(shoplist) {
        this.shoplist = shoplist;
        this.writer = new BinaryWriter();
    }

    /**
     * パケットを生成する
     * @returns 
     */
    getPacket() {
        this.writer.setUint8(0x0C);
        this.writer.setUint8(this.shoplist.length);
        this.shoplist.forEach(shop => {
            this.writer.setUint32(shop.id); // ID
            this.writer.setUint8(shop.type); // 選択されるタイプ
            this.writer.setString(shop.description); // 説明
            this.writer.setString(shop.name); // 名前
        });
        return this.writer.toBuffer();
    }
}