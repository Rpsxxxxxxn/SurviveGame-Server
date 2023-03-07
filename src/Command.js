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
            case 'userlist_all':
                this.userListAll(player);
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
        player.character.str = 10000;
        player.character.dex = 1000;
        player.character.int = 1000;
        player.character.luk = 1;
        player.character.spd = 50;
        player.character.vit = 10000;
        player.onSendPacket(new AddChat(null, `ALL BUFFが適用されました。`));
    }

    /**
     * プレイヤーを最強にする
     * @param {*} player 
     */
    godMode(player) {
        player.character.hp = 10000;
        player.character.str = 10000;
        player.character.dex = 10;
        player.character.luk = .5;
        player.character.vit = 10000;
        player.onSendPacket(new AddChat(null, `GOD MODEが適用されました。`));
    }

    /**
     * サーバーに接続している全てのプレイヤーを表示する
     */
    userListAll(player) {
        player.onSendPacket(new AddChat(null, 'IP, ID, 名前'));
        this.gameServer.players.forEach(player => {
            const message = `
            ${player.webSocket._socket.remoteAddress},
            ${player.character.id},
            ${player.character.name}`;
            player.onSendPacket(new AddChat(null, message));
        });
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