const BinaryWriter = require("../common/BinaryWriter");

module.exports = class UpdateBullets {
    constructor(bullets) {
        this.bullets = bullets;
        this.writer = new BinaryWriter();
    }

    getPacket() {
        this.writer.setUint8(0x07);
        this.writer.setUint32(this.bullets.length);
        this.bullets.forEach(bullet => {
            this.writer.setFloat32(bullet.x);
            this.writer.setFloat32(bullet.y);
            this.writer.setFloat32(bullet.r);
            this.writer.setFloat32(bullet.angle);
            this.writer.setFloat32(bullet.speed);
            this.writer.setUint8(bullet.owner);
        });
        return this.writer.toBuffer();
    }
}