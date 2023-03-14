module.exports = class UpdatePlayers {
    constructor(players) {
        this.players = players;
        this.writer = new BinaryWriter();
    }

    getPacket() {
        this.writer.setUint8(0x0A);
        this.writer.setUint16(this.players.length);
        this.players.forEach(player => {
            this.writer.setUint32(player.character.id);

            // 武器の数
            this.writer.setUint8(player.weapons.length);
            player.weapons.forEach(weapon => {
                this.writer.setUint8(weapon.id);
                this.writer.setUint8(weapon.ammo);
            });
            // アーマーの数
            this.writer.setUint8(player.armors.length);
            player.armors.forEach(armor => {
                this.writer.setUint8(armor.id);
                this.writer.setUint8(armor.ammo);
            });
        });
        return this.writer.toBuffer();
    }
}