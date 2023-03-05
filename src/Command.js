const BinaryWriter = require("./common/BinaryWriter");
const AddChat = require("./packet/AddChat");

module.exports = class Command {
    constructor(gameServer) {
        this.gameServer = gameServer;
        this.writer = new BinaryWriter();
    }

    /**
     * リモートコマンドの実行
     * @param {*} command 
     */
    execute(player, message) {
        const command = String(message).slice(1);
        const args = command.split(' ');
        switch (args[0]) {
            case 'allbuff':
                this.allBuff(player);
                break;
            case 'godmode':
                this.godMode(player);
                break;
            default:
                player.onSendPacket(new AddChat(null, `コマンドが見つかりません。`));
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
        player.onSendPacket(new AddChat(null, `コマンドが見つかりません。`));
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
        player.onSendPacket(new AddChat(null, `コマンドが見つかりません。`));
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