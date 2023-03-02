const Character = require("./entity/Character");
const Vector2 = require("./common/Vector2");

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
        this.character = new Character(id);

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
    }

    /**
     * 観戦の開始
     * @param {*} reader 
     * @returns 
     */
    onSpectate(reader) {
        if (this.character.isAlive) return;
    }

    /**
     * チャットの追加
     * @param {*} reader 
     */
    onAddChat(reader) {
        const chat = reader.getString();
        this.gameServer.addChat(this, chat);
    }

    /**
     * プレイヤーの動作
     * @param {*} reader 
     */
    onMove(reader) {
        if (!this.character.isAlive) return;
        this.character.position = new Vector2(reader.getFloat32(), reader.getFloat32());
        this.character.direction = reader.getUint8();
    }

    /**
     * クライアントからのメッセージを処理する
     * @param {*} reader 
     */
    onMessageHandler(reader) {
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
            case 3: // プレイヤーの攻撃
                this.onShoot(reader);
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
        this.webSocket.send(writer);
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
        this.gameServer.removeQuadtreePosition(this);
    }

}