const Character = require("./Character");
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

        this.onDisconnect = null;
        this.webSocket.on('message', this.onMessageHandler.bind(this));
        this.webSocket.on('close', this.onDisconnect.bind(this));
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
        this.character.rotation = reader.getFloat32();
    }

    /**
     * クライアントからのメッセージを処理する
     * @param {*} reader 
     */
    onMessageHandler(reader) {
        const type = reader.getUint8();
        switch (type) {
            case 0:
                this.onGamePlay(reader);
                break;
            case 1:
                this.onSpectate(reader);
                break;
            case 2:
                this.onMove(reader);
                break;
            case 3:
                this.onShoot(reader);
                break;
            case 100:
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
        if (this.webSocket.type === 'open') {
            this.webSocket.send(writer.toBuffer());
        }
    }

    onPhysicsUpdate() {
        if (!this.character.isAlive) return;
    }

}