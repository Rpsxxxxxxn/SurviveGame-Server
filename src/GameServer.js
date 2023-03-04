const fs = require("fs");
const os = require("os");
const { WebSocket } = require("ws");
const Logger = require("./common/Logger");
const QuadTree = require("./common/QuadTree");
const Rectangle = require("./common/Rectangle");

const AddChat = require("./packet/AddChat");
const AddPlayer = require("./packet/AddPlayer");
const UpdateServerInfo = require("./packet/UpdateServerInfo");
const Player = require("./Player");
const Command = require("./Command");
const StopWatch = require("./common/StopWatch");
const UpdatePlayers = require("./packet/UpdatePlayers");
const TrackingId = require("./packet/TrackingId");
const UpdateCharacters = require("./packet/UpdateCharacters");
const UpdateServerUsage = require("./packet/UpdateServerUsage");
const AddBorder = require("./packet/AddBorder");
const Character = require("./entity/Character");
const Utils = require("./common/Utils");
const ObjectNode = require("./common/ObjectNode");
const Vector2 = require("./common/Vector2");

module.exports = class GameServer {
    constructor() {
        this.logger = new Logger();
        this.config = JSON.parse(this.readConfigText());
        this.command = new Command(this);
        this.stopWatch = new StopWatch();
        this.movePacketWatch = new StopWatch();
        this.generateId = 0;
        this.players = [];
        this.characters = [];
        this.bullets = [];
        this.deltaTime = 0;

        this.gameLevel = 1; // レベル
        this.gameExp = 0; // 経験値
        this.gameStage = 1; // ステージ

        this.border = this.config.BorderSize;
        this.quadtree = new QuadTree(new Rectangle(this.border.x, this.border.y, this.border.w, this.border.h), 8);
        this.webSocketServer = new WebSocket.Server({ port: this.config.ServerPort });
        this.webSocketServer.on('connection', this.onConnection.bind(this));
        this.loadIPBanList();

        for (let i = 0; i < 200; i++) {
            this.addEnemyCharacter();
        }
    }

    addExp(exp) {
        this.gameExp += exp;
        if (this.gameExp >= this.gameLevel * 100) {
            this.gameLevel++;
            this.gameExp = 0;
        }
    }

    /**
     * ゲームサーバーの開始ログ
     */
    startLogs() {
        this.logger.log("Server started.");
        this.logger.log(`ServerPort: ${this.config.ServerPort}`);
        this.logger.log(`Border: ${JSON.stringify(this.border)}`);
        this.logger.log(`DebugMode: ${this.config.DebugMode}`);
        this.logger.log("Waiting for connections...");
        this.stopWatch.start();
    }

    /**
     * サーバーのループ処理
     */
    mainloop() {
        // if (this.checkGameEnd()) {
        //     this.stopWatch.stop();
        //     this.logger.log("Game end.");
        // }

        this.objectUpdate();

        this.broadcastPacket(new UpdateCharacters(this.characters));
        
        this.calcDeltaTime();
        this.calcFrameRate();
        this.checkDeltaTime();
        this.checkFrameRate();

        // this.broadcastPacket(new UpdateServerUsage(
        //     this.getCpuUsage(),
        //     this.getMemoryUsage(),
        //     this.deltaTime,
        //     this.frameRate));
        setTimeout(this.mainloop.bind(this), this.config.ServerLoopInterval);
    }

    getElapsedTimeSecond() {
        return this.stopWatch.getElapsedTime() / 1000;
    }

    /**
     * ゲームが終了したかどうかを判定する
     * @returns 
     */
    checkGameEnd() {
        return this.stopWatch.getElapsedTime() > this.config.ServerEndTime;
    }

    /**
     * 更新処理
     */
    objectUpdate() {
        // プレイヤーの更新
        this.players.forEach(player => {
            // player.update()
            // const viewboxObjects = this.quadtree.query(new Rectangle(
            //     player.character.viewerBox.x,
            //     player.character.viewerBox.y,
            //     player.character.viewerBox.w,
            //     player.character.viewerBox.h));
            player.onShootBullet();
        });
        const targetCharacters = this.characters.filter(character => character.isAlive && Utils.isNotEmpty(character.parent));
        this.characters.forEach((character) => {
            targetCharacters.forEach(target => {
                if (character.id !== target.id && character.parent !== target.parent) {
                    character.targetTrackingMove(target);
                }
            });
            this.queryQuadtree(character).forEach((target) => {
                this.onRigidbodyCollision(character, target.object);
            });
            character.positionMoveLimit(this.border);
            this.updateQuadtreePosition(character);
        });
        this.bullets.forEach((bullet) => {
            this.queryQuadtree(bullet).forEach((target) => {
                this.onBulletCollision(bullet, target.object);
            });
            this.updateQuadtreePosition(bullet);
        });
    }

    /**
     * キャラクターの衝突判定
     * @param {*} character 
     * @param {*} bullet 
     * @returns 
     */
    onBulletCollision(character, bullet) {
        // 自分の弾に当たった場合は処理しない
        if (Utils.isNotEmpty(character.parent) && character.id === bullet.parent.id) {
            return;
        }
        const distance = character.position.distance(bullet.position);
        if (distance > character.size + bullet.size) return; // 衝突していない

        character.hp -= bullet.damage;
        if (character.hp <= 0) {
            character.isAlive = false;
            // this.broadcastPacket(new UpdatePlayers(this.players));
        }
        bullet.isAlive = false;
    }

    /**
     * 剛体の衝突判定
     * @param {*} self 
     * @param {*} target 
     * @returns 
     */
    onRigidbodyCollision(self, target) {
        if (self.id === target.id) return; // 自分自身との衝突は無視
        const radius = self.size + target.size;
        const distance = self.position.distance(target.position);
        const push = Math.min((radius - distance) / distance, radius - distance);

        if (push / radius < 0) return; // 衝突していない

        const ms = self.getSquaredSize() + target.getSquaredSize();
        const m1 = push * (target.getSquaredSize() / ms);
        const m2 = push * (self.getSquaredSize() / ms);
        const direction = Vector2.direction(self.position, target.position);

        self.position.sub(direction.mulScalar(m1));
        target.position.add(direction.mulScalar(m2));
    }

    /**
     * プレイヤー位置の追加
     * @param {*} character 
     */
    appendQuadtreePosition(character) {
        // 既に追加済みの場合は処理しない
        if (Utils.isNotEmpty(character.quadTreeNode)) {
            return;
        }
        // プレイヤーの位置を追加
        const objectNode = new ObjectNode(
            character.position.x - character.size,
            character.position.y - character.size,
            character.size * 2, character.size * 2, character);
        character.quadTreeNode = objectNode;
        this.quadtree.insert(objectNode);
    }

    /**
     * プレイヤーの位置の更新
     * @param {*} character 
     */
    updateQuadtreePosition(character) {
        // 位置が変わっていない場合は処理しない
        if (character.quadTreeNode.x === character.position.x - character.size &&
            character.quadTreeNode.y === character.position.y - character.size &&
            character.quadTreeNode.w === character.size * 2 &&
            character.quadTreeNode.h === character.size * 2) {
            return;
        }

        this.removeQuadtreePosition(character);
        this.appendQuadtreePosition(character);
    }

    /**
     * プレイヤー位置の削除
     * @param {*} character 
     */
    removeQuadtreePosition(character) {
        // 位置が設定されていない場合は処理しない
        if (Utils.isEmpty(character.quadTreeNode)) {
            return;
        }
        this.quadtree.remove(character.quadTreeNode);
        character.quadTreeNode = null;
    }

    /**
     * クエリーの実行
     * @param {*} character 
     * @returns 
     */
    queryQuadtree(value) {
        const result = this.quadtree.query(value.quadTreeNode);
        return result;
    }

    /**
     * パケットのブロードキャスト
     * @param {*} packet 
     */
    broadcastPacket(packet) {
        // パケットの送信
        this.players.forEach(client => {
            client.onSendPacket(packet);
        });
    }

    /**
     * チャットのブロードキャスト
     * @param {*} sender 
     * @param {*} message 
     */
    addChat(sender, message) {
        // チャットの送信
        if (this.config.PlayerChatEnabled) {
            this.broadcastPacket(new AddChat(sender, message));
        }
    }

    /**
     * プレイヤーの追加
     * @param {*} player 
     */
    addPlayer(player) {
        this.players.push(player);
    }

    /**
     * プレイヤーの削除
     * @param {*} player 
     */
    removePlayer(player) {
        this.players.splice(this.players.indexOf(player), 1);
    }

    /**
     * キャラクターの追加
     * @param {*} character 
     */
    addCharacter(character) {
        this.characters.push(character);
        this.appendQuadtreePosition(character);
    }

    /**
     * キャラクターの削除
     * @param {*} character 
     */
    removeCharacter(character) {
        this.characters.splice(this.characters.indexOf(character), 1);
        this.removeQuadtreePosition(character);
    }

    /**
     * 弾の追加
     * @param {*} bullet 
     */
    addBullet(bullet) {
        this.bullets.push(bullet);
        this.appendQuadtreePosition(bullet);
    }

    /**
     * 弾の削除
     * @param {*} bullet 
     */
    removeBullet(bullet) {
        this.bullets.splice(this.bullets.indexOf(bullet), 1);
        this.removeQuadtreePosition(bullet);
    }

    /**
     * 接続時の処理
     * @param {*} webSocket 
     */
    onConnection(webSocket) {
        if (this.players.length >= this.config.MaxPlayers ||
            // this.players.find(client => client.webSocket._socket.remoteAddress === webSocket._socket.remoteAddress) ||
            this.checkIPBanned(webSocket._socket.remoteAddress)) {
            webSocket.close();
            return;
        }
        // プレイヤーの生成
        const player = new Player(this, webSocket, this.getGenerateId());
        player.onSendPacket(new UpdateServerInfo(this.config.ServerName, this.config.ServerDescription, 'ALPHA'));
        player.onSendPacket(new AddBorder(this.border));

        // プレイヤーの追加
        this.addPlayer(player);
        this.addCharacter(player.character);

        player.onSendPacket(new UpdatePlayers(this.players));
        player.onSendPacket(new TrackingId(player.character.id));   
        player.onSendPacket(new AddChat(null, `${this.config.ServerName}`));
        player.onSendPacket(new AddChat(null, `${this.config.ServerDescription}`));
        player.onSendPacket(new AddChat(null, `${this.config.ServerStartMessage}`));

        this.logger.log(`Player id: ${player.character.id} address: ${webSocket._socket.remoteAddress} port: ${webSocket._socket.remotePort}`);
    }

    /**
     * IDの生成
     * @returns 
     */
    getGenerateId() {
        if (this.generateId >= 999999999) {
            this.generateId = 0;
        }
        return this.generateId++;
    }

    /**
     * 設定ファイルの読込
     * @returns 
     */
    readConfigText() {
        return fs.readFileSync("./data/Config.json", "utf8");
    }

    /**
     * CPU使用率の計算
     * @returns 
     */
    getCpuUsage() {
        return Math.round(os.loadavg()[0] * 100) / 100;
    }

    /**
     * メモリ使用量の計算
     * @returns 
     */
    getMemoryUsage() {
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        return Math.round(used * 100) / 100;
    }

    /**
     * CPU使用率の表示
     * @returns 
     */
    getDisplayCpuUsage() {
        return `CPU: ${this.getCpuUsage()}%`;
    }

    /**
     * メモリ使用量の表示
     * @returns 
     */
    getDisplayMemoryUsage() {
        return `Memory: ${this.getMemoryUsage()}MB`;
    }

    /**
     * フレーム間隔の計算
     */
    calcDeltaTime() {
        this.deltaTime = Date.now() - this.lastTime;
        this.lastTime = Date.now();
    }

    /**
     * フレームレートの計算
     */
    calcFrameRate() {
        this.frameRate = 1000 / this.deltaTime;
    }

    /**
     * フレーム間隔のチェック
     */
    checkDeltaTime() {
        if (this.deltaTime > 1000) {
            throw new Error('DeltaTime is too large.');
        }
    }

    /**
     * フレームレートのチェック
     */
    checkFrameRate() {
        if (this.frameRate < 5) {
            throw new Error('FrameRate is too low.');
        }
    }

    /**
     * IPアドレスの禁止
     * @param {*} ip 
     */
    addIPBanned(ip) {
        this.ipBanList.push(ip);
    }

    /**
     * 禁止IPアドレスの読込
     */
    loadIPBanList() {
        this.ipBanList = fs.readFileSync("./data/IPBanList.txt", "utf8").split('¥r¥n');
    }

    /**
     * 禁止IPアドレスの保存
     */
    saveIPBanList() {
        fs.writeFileSync("./data/IPBanList.txt", this.ipBanList.join('¥r¥n'));
    }

    /**
     * IPアドレスの禁止チェック
     * @param {*} ip 
     * @returns 
     */
    checkIPBanned(ip) {
        return this.ipBanList.includes(ip);
    }

    /**
     * プレイヤーの追加
     */
    addEnemyCharacter() {
        const enemy = new Character(null, this.getGenerateId());
        enemy.position.x = Math.random() * this.border.w;
        enemy.position.y = Math.random() * this.border.h;
        this.addCharacter(enemy);
    }
}