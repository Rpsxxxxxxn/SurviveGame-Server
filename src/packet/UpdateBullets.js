const BinaryWriter = require("../common/BinaryWriter");

module.exports = class UpdateBullets {
    /**
     * 弾の更新
     * @param {*} bullets 
     */
    constructor(bullets) {
        this.bullets = bullets;
        this.writer = new BinaryWriter();
    }

    /**
     * パケットを生成する
     * @returns 
     */
    getPacket() {
        this.writer.setUint8(0x0A);
        this.writer.setUint16(this.bullets.length);
        this.bullets.forEach(bullet => {
            this.writer.setUint32(bullet.id);
            this.writer.setFloat32(bullet.position.x);
            this.writer.setFloat32(bullet.position.y);
            this.writer.setFloat32(bullet.size);
        });
        return this.writer.toBuffer();
    }
}