const BinaryWriter = require("../common/BinaryWriter");

module.exports = class UpdateCharacters {
    constructor(characters) {
        this.characters = characters;
        this.writer = new BinaryWriter();
    }

    getPacket() {
        this.writer.setUint8(0x07);
        this.writer.setUint16(this.characters.length);
        this.characters.forEach(character => {
            this.writer.setUint32(character.id);
            this.writer.setUint8(character.type);
            this.writer.setFloat32(character.position.x);
            this.writer.setFloat32(character.position.y);
            this.writer.setFloat32(character.direction);
        });
        return this.writer.toBuffer();
    }
}