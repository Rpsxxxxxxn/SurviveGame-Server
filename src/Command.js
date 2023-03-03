const BinaryReader = require("./common/BinaryReader");
const BinaryWriter = require("./common/BinaryWriter");

module.exports = class Command {
    constructor(gameServer) {
        this.gameServer = gameServer;
        this.reader = new BinaryReader();
        this.writer = new BinaryWriter();
    }

    /**
     * リモートコマンドの実行
     * @param {*} command 
     */
    execute(player, message) {
        const command = message.slice(1);
        const args = command.split(' ');
        switch (args[0]) {
            case 'allbuff':
                break;
            case 'godmode':
                break;
            default:
                break;
        }
    }

    /**
     * プレイヤーにバフを与える
     * @param {*} player 
     */
    allBuff(player) {
        player.character.str = 9999;
        player.character.dex = 9999;
        player.character.int = 9999;
        player.character.luk = 9999;
        player.character.spd = 9999;
        player.character.vit = 9999;
    }

    /**
     * プレイヤーを最強にする
     * @param {*} player 
     */
    godMode(player) {
        player.character.hp = 9999;
        player.character.str = 9999;
        player.character.dex = 9999;
        player.character.int = 9999;
        player.character.luk = 9999;
        player.character.spd = 9999;
        player.character.vit = 9999;
    }

    /**
     * リモートコマンドかどうかをチェックする
     * @param {*} message 
     * @returns 
     */
    checkRemoteCommand(message) {
        return message.startsWith('/');
    }
}