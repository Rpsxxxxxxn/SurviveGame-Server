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
const UpdateBullets = require("./packet/UpdateBullets");
const Bullet = require("./entity/Bullet");
const UpdateLevel = require("./packet/UpdateLevel");

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

        this.dummyPlayer = new Player(this, null, 0);
        this.border = this.config.BorderSize;
        this.quadtree = new QuadTree(new Rectangle(this.border.x, this.border.y, this.border.w, this.border.h), 8);
        this.webSocketServer = new WebSocket.Server({ port: this.config.ServerPort });
        this.webSocketServer.on('connection', this.onConnection.bind(this));
        this.loadIPBanList();

        for (let i = 0; i < 200; i++) {
            this.onAddEnemyCharacter();
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
        // オブジェクトの更新
        this.objectUpdate();

        // this.onBroadcastPacket(new UpdateCharacters(this.characters));
        this.onBroadcastPacket(new UpdateBullets(this.bullets));
        
        this.calcDeltaTime();
        this.calcFrameRate();
        this.checkDeltaTime();
        this.checkFrameRate();
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
            player.onShootBullet();
            player.onUpdate();
        });
        // 目標にするキャラクターを取得する
        const targetPlayer = this.getMaxScorePlayer()
        // キャラクターの更新
        this.characters.forEach((character) => {
            // 目標にするキャラクターを設定する
            if (Utils.isNotEmpty(targetPlayer) && character.type === 1) {
                character.targetTrackingMove(targetPlayer.character);
            }
            this.onQueryQuadtree(character).forEach((target) => {
                this.onRigidbodyCollision(character, target.object);
            });
            character.onPhysicsUpdate();
            character.positionMoveLimit(this.border);
            this.onUpdateQuadtreePosition(character);
        });
        // 弾の更新
        this.bullets.forEach((bullet) => {
            bullet.onPhysicsUpdate(this.border);
            this.onUpdateQuadtreePosition(bullet);
            // if (!this.isAlive) {
            //     this.onRemoveBullet(bullet);
            // }
        });
    }

    /**
     * 最大スコアのプレイヤーを取得する
     * @returns 
     */
    getMaxScorePlayer() {
        let maxPlayer = null;
        this.players.forEach((player) => {
            if (Utils.isEmpty(maxPlayer) || maxPlayer.character.getScore() < player.character.getScore()) {
                maxPlayer = player;
            }
        });
        return maxPlayer;
    }

    /**
     * 経験値の追加
     * @param {*} exp 
     */
    onAddExp(exp) {
        this.gameExp += exp;
        if (this.gameExp >= this.gameLevel * 100) {
            this.gameLevel++;
            this.gameExp = 0;
        }
        // レベルアップの通知
        this.onBroadcastPacket(new UpdateLevel(this.gameLevel, this.gameExp));
    }

    /**
     * 敵キャラクターの追加
     * @param {*} position 
     */
    onAddEnemyCharacter(position) {
        const enemyCharacter = new Character(null, 1, this.getGenerateId());
        // 指定された位置に配置
        if (Utils.isNotEmpty(position)) {
            enemyCharacter.position = position;
        } else {
            // ランダムな位置に配置
            enemyCharacter.position.x = Math.random() * this.border.w;
            enemyCharacter.position.y = Math.random() * this.border.h;
        }
        this.onAddCharacter(enemyCharacter);
    }

    /**
     * 弾丸の発射
     * @param {*} player 
     */
    onShootBullet(player, direction) {
        const bullet = new Bullet(
            player, // 発射したプレイヤー
            2, // 弾丸の種類
            this.getGenerateId(), // ID
            player.character.position.copy(), // 位置
            Utils.isNotEmpty(direction) ? direction : Math.PI * Math.random(), // 方向
            10, // 速度
            20); // 攻撃力
        this.onAddBullet(bullet);
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
            // this.onBroadcastPacket(new UpdatePlayers(this.players));
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
        if (self.id === target.id || self.type !== target.type) return; // 自分自身との衝突は無視
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
    onAppendQuadtreePosition(character) {
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
    onUpdateQuadtreePosition(character) {
        // 位置が変わっていない場合は処理しない
        if (character.quadTreeNode.x === character.position.x - character.size &&
            character.quadTreeNode.y === character.position.y - character.size &&
            character.quadTreeNode.w === character.size * 2 &&
            character.quadTreeNode.h === character.size * 2) {
            return;
        }

        this.onRemoveQuadtreePosition(character);
        this.onAppendQuadtreePosition(character);
    }

    /**
     * プレイヤー位置の削除
     * @param {*} character 
     */
    onRemoveQuadtreePosition(character) {
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
    onQueryQuadtree(value) {
        const result = this.quadtree.query(value.quadTreeNode);
        return result;
    }

    onQueryQuadtreeRectangle(rectangle) {
        const result = this.quadtree.query(rectangle);
        return result;
    }

    /**
     * パケットのブロードキャスト
     * @param {*} packet 
     */
    onBroadcastPacket(packet) {
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
    onAddChat(sender, message) {
        // チャットの送信
        if (this.config.PlayerChatEnabled) {
            this.onBroadcastPacket(new AddChat(sender, message));
        }
    }

    /**
     * プレイヤーの追加
     * @param {*} player 
     */
    onAddPlayer(player) {
        this.players.push(player);
    }

    /**
     * プレイヤーの削除
     * @param {*} player 
     */
    onRemovePlayer(player) {
        this.players.splice(this.players.indexOf(player), 1);
    }

    /**
     * キャラクターの追加
     * @param {*} character 
     */
    onAddCharacter(character) {
        this.characters.push(character);
        this.onAppendQuadtreePosition(character);
    }

    /**
     * キャラクターの削除
     * @param {*} character 
     */
    onRemoveCharacter(character) {
        this.characters.splice(this.characters.indexOf(character), 1);
        this.onRemoveQuadtreePosition(character);
    }

    /**
     * 弾の追加
     * @param {*} bullet 
     */
    onAddBullet(bullet) {
        this.bullets.push(bullet);
        this.onAppendQuadtreePosition(bullet);
    }

    /**
     * 弾の削除
     * @param {*} bullet 
     */
    onRemoveBullet(bullet) {
        this.bullets.splice(this.bullets.indexOf(bullet), 1);
        this.onRemoveQuadtreePosition(bullet);
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
        this.onAddPlayer(player);
        this.onAddCharacter(player.character);

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
            // throw new Error('FrameRate is too low.');
        }
    }

    /**
     * IPアドレスの禁止
     * @param {*} ip 
     */
    onAddIPBanned(ip) {
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
    onBroadcastUpdateServerUsage() {
        this.onBroadcastPacket(new UpdateServerUsage(
            this.getCpuUsage(),
            this.getMemoryUsage(),
            this.deltaTime,
            this.frameRate));
    }
}