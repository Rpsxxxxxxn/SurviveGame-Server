const Character = require("./entity/Character");
const Vector2 = require("./common/Vector2");
const StopWatch = require("./common/StopWatch");
const AddChat = require("./packet/AddChat");
const { WebSocket } = require("ws");
const BinaryReader = require("./common/BinaryReader");

module.exports = class Player {
    /**
     * プレイヤーの生成
     * @param {*} gameServer 
     * @param {*} webSocket 
     * @param {*} id 
     */
    constructor(gameServer, webSocket, id) {
        this.gameServer = gameServer;
        this.webSocket = webSocket;
        this.character = new Character(this, id);
        this.chatStopWatch = new StopWatch();
        this.chatStopWatch.start();

        this.webSocket.on('message', this.onMessageHandler.bind(this));
        this.webSocket.on('close', this.onDisconnect.bind(this));
    }

    /**
     * プレイヤー情報の更新
     */
    update() {
        this.onPhysicsUpdate();
    }

    /**
     * ゲームの開始
     * @param {*} reader 
     * @returns 
     */
    onGamePlay(reader) {
        if (this.character.isAlive) return;
        this.character.name = reader.getString();
        this.character.isAlive = true;
        this.character.position = Vector2.random();
        this.gameServer.addChat(null, "ゲームに入室しました。");
    }

    /**
     * 観戦の開始
     * @param {*} reader 
     * @returns 
     */
    onSpectate(reader) {
        if (this.character.isAlive) return;
        const player = this.gameServer.clients.find(client => client.score);
        player.onSendPacket(new AddChat(this, `${this.character.name ?? '名前無し'}が観戦しています。`));
    }

    /**
     * チャットの追加
     * @param {*} reader 
     */
    onAddChat(reader) {
        const message = reader.getString();
        // チャットの内容をチェックする
        if (this.gameServer.command.checkRemoteCommand(message)) {
            this.gameServer.command.execute(message);
            this.gameServer.logger.log(`[Command] ${this.character.name ?? '名前無し'}: ${message}`);
        } else {
            // チャットのクールタイムをチェックする
            if (this.chatStopWatch.getElapsedTime() < this.gameServer.config.PlayerChatCooldown) {
                this.onSendPacket(new AddChat(null, "チャットのクールタイム中です。連投は禁止です。"));
                return;
            }
            // チャットの長さをチェックする
            if (message.length > 0 && message.length < this.gameServer.config.PlayerChatLength) {
                this.gameServer.addChat(this, message);
                this.chatStopWatch.reset();
                this.chatStopWatch.start();
                this.gameServer.logger.chat(this.webSocket._socket.remoteAddress, `${this.character.name ?? '名前無し'}: ${message}`);
            }
        }
    }

    /**
     * プレイヤーの動作
     * @param {*} reader 
     */
    onMove(reader) {
        if (!this.character.isAlive) return;
        const direction = reader.getUint8();
        this.character.direction = direction * (Math.PI / 4);
        this.character.position.add(Vector2.fromAngle(this.character.direction).mulScalar(4));
    }

    /**
     * クライアントからのメッセージを処理する
     * @param {*} reader 
     */
    onMessageHandler(event) {
        const reader = new BinaryReader(event);
        // パケットのタイプを取得する
        const type = reader.getUint8();
        switch (type) {
            case 0: // ゲームの開始
                this.onGamePlay(reader);
                break;
            case 1: // 観戦の開始
                this.onSpectate(reader);
                break;
            case 2: // プレイヤーの動作
                this.onMove(reader);
                break;
            case 100: // チャットの追加
                this.onAddChat(reader);
                break;
            default:
                break;
        }
    }

    /**
     * クライアントへのパケットを送信する
     * @param {*} writer 
     */
    onSendPacket(writer) {
        // クライアントへの送信
        if (this.webSocket._socket.readyState === 'open') {
            this.webSocket.send(writer.getPacket());
        }
    }

    /**
     * プレイヤーの攻撃
     * @returns 
     */
    onPhysicsUpdate() {
        if (!this.character.isAlive) return;

    }

    /**
     * プレイヤーの削除
     */
    onDisconnect() {
        this.character.isAlive = false;
        this.gameServer.removePlayer(this);
        this.gameServer.removeCharacter(this.character);
        this.gameServer.removeQuadtreePosition(this.character);
    }
}