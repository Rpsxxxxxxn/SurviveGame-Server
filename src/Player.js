const Character = require("./entity/Character");
const Vector2 = require("./common/Vector2");
const StopWatch = require("./common/StopWatch");
const AddChat = require("./packet/AddChat");
const { WebSocket } = require("ws");
const BinaryReader = require("./common/BinaryReader");
const Bullet = require("./entity/Bullet");
const Utils = require("./common/Utils");
const UpdateCharacters = require("./packet/UpdateCharacters");
const UpdateBullets = require("./packet/UpdateBullets");

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
        this.character = new Character(this, 0, id, new Vector2(this.gameServer.border.w * .5, this.gameServer.border.h * .5), 24);
        this.chatStopWatch = new StopWatch();
        this.chatStopWatch.start();
        this.bulletCooldown = new StopWatch();
        this.bulletCooldown.start();
        this.closestEnemy = null;
        this.spectatePlayer = null;
        if (this.webSocket) {
            this.webSocket.on('message', this.onMessageHandler.bind(this));
            this.webSocket.on('close', this.onDisconnect.bind(this));
        }
    }

    /**
     * プレイヤーの更新
     */
    onUpdate() {
        const viewNodes = this.gameServer.onQueryQuadtreeRectangle(this.character.getViewerBox());
        const updateCharacters = viewNodes.map(node => node.object).filter(object => object.type === 0 || object.type === 1 || object.type === 3);
        this.onSendPacket(new UpdateCharacters(updateCharacters));

        const viewsBullets = viewNodes.map(node => node.object).filter(object => object.type === 2);
        this.onSendPacket(new UpdateBullets(viewsBullets));
        // 一番近い敵を探す
        let minDist = this.gameServer.border.w;
        this.closestEnemy = null;
        updateCharacters.forEach(character => {
            if (character.type === 1) {
                let distance = this.character.position.distance(character.position);
                if (distance < minDist) {
                    this.closestEnemy = character;
                    minDist = distance;
                }
            }
        });
    }

    /**
     * クライアントからのメッセージを処理する
     * @param {*} reader 
     */
    onMessageHandler(event) {
        const reader = new BinaryReader(event);
        // パケットのサイズが0または2048バイト以上の場合は受け取らない
        if (reader.view.byteLength === 0 && reader.view.byteLength > 2048) {
            return;
        }

        // パケットのタイプを取得する
        const type = reader.getUint8();
        switch (type) {
            case 0x00: // ゲームの開始
                this.onGamePlay(reader);
                break;
            case 0x01: // 観戦の開始
                this.onSpectate(reader);
                break;
            case 0x02: // プレイヤーの動作
                this.onMove(reader);
                break;
            case 0x03: // ショップ選択
                this.onShopSelect(reader);
                break;
            case 0x64: // チャットの追加
                this.onAddChat(reader);
                break;
            default:
                break;
        }
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
        this.gameServer.onAddChat(null, "ゲームに入室しました。");
    }

    /**
     * 観戦の開始
     * @param {*} reader 
     * @returns 
     */
    onSpectate(reader) {
        if (this.character.isAlive) return;
        if (Utils.isNotEmpty(this.spectatePlayer)) {
            this.spectatePlayer = null;
        }
        // 観戦するプレイヤーを選択する
        this.spectatePlayer = this.gameServer.players.reduce((a, b) => { return Math.max(a.character.score, b.character.score) });
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
            this.gameServer.command.execute(this, message);
            this.gameServer.logger.log(`[Command] ${this.character.name ?? '名前無し'}: ${message}`);
        } else {
            // チャットのクールタイムをチェックする
            if (this.chatStopWatch.getElapsedTime() < this.gameServer.config.PlayerChatCooldown) {
                this.onSendPacket(new AddChat(null, "チャットのクールタイム中です。連投は禁止です。"));
                return;
            }
            // チャットの長さをチェックする
            if (message.length > 0 && message.length < this.gameServer.config.PlayerChatLength) {
                this.gameServer.onAddChat(this, message);
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
        this.character.position.add(Vector2.fromAngle(this.character.direction).mulScalar(2));
    }

    /**
     * ショップの選択
     * @param {*} reader 
     */
    onShopSelect(reader) {
        if (!this.character.isAlive) return;
        const shopId = reader.getUint8();
        const shop = this.gameServer.shops.find(shop => shop.id === shopId);
        if (shop) {
            shop.onSelect(this);
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
     * プレイヤーの削除
     */
    onDisconnect() {
        this.character.isAlive = false;
        this.gameServer.onRemovePlayer(this);
        this.gameServer.onRemoveCharacter(this.character);
    }

    /**
     * 弾の発射
     * @returns 
     */
    onShootBullet() {
        if (this.getBulletCooldown()) return;
        if (this.closestEnemy) {
            const direction = this.character.position.direction(this.closestEnemy.position);
            this.gameServer.onShootBullet(this, direction);

            this.gameServer.onShootBullet(this, direction - Math.PI * .2);
            this.gameServer.onShootBullet(this, direction - Math.PI * .1);
            this.gameServer.onShootBullet(this, direction + Math.PI * .2);
            this.gameServer.onShootBullet(this, direction + Math.PI * .1);
        } else {
            this.gameServer.onShootBullet(this);
        }
        this.bulletCooldown.reset();
        this.bulletCooldown.start();
    }

    /**
     * 弾のクールタイムをチェックする
     * @returns 
     */
    getBulletCooldown() {
        return this.bulletCooldown.getElapsedTime() < (1000 / this.character.dex);
    }
}