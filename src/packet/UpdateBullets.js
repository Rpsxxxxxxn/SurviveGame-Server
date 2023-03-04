const BinaryWriter = require("../common/BinaryWriter");

module.exports = class UpdateBullets {
    constructor(bullets) {
        this.bullets = bullets;
        this.writer = new BinaryWriter();
    }

    getPacket() {
        this.writer.setUint8(0x0A);
        this.writer.setUint32(this.bullets.length);
        this.bullets.forEach(bullet => {
            this.writer.setUint32(bullet.id);
            this.writer.setFloat32(bullet.x);
            this.writer.setFloat32(bullet.y);
            this.writer.setFloat32(bullet.size);
        });
        return this.writer.toBuffer();
    }
}