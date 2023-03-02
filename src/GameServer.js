const fs = require("fs");
const os = require("os");
const { WebSocket } = require("ws");
const Logger = require("./common/Logger");
const QuadTree = require("./common/QuadTree");
const Rectangle = require("./common/Rectangle");
const AddChat = require("./packet/AddChat");
const Player = require("./Player");

module.exports = class GameServer {
    constructor() {
        this.logger = new Logger();
        this.config = JSON.parse(this.readConfigText());
        this.generateId = 0;
        this.clients = [];
        this.characters = [];
        this.bullets = [];
        this.deltaTime = 0;

        this.border = this.config.BorderSize;
        this.quadtree = new QuadTree(new Rectangle(this.border.x, this.border.y, this.border.w, this.border.h), 8);
        this.webSocketServer = new WebSocket.Server({ port: this.config.ServerPort });
        this.webSocketServer.on('connection', this.onConnection.bind(this));
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
    }

    /**
     * サーバーのループ処理
     */
    mainloop() {
        this.objectUpdate();

        this.calcDeltaTime();
        this.calcFrameRate();
        setTimeout(this.mainloop.bind(this), this.config.ServerLoopInterval);
    }

    /**
     * 更新処理
     */
    objectUpdate() {
        this.clients.forEach(player => player.update());
    }

    /**
     * プレイヤー位置の追加
     * @param {*} player 
     */
    appendQuadtreePosition(player) {
        this.quadtree.insert(player.position);
    }

    /**
     * プレイヤーの位置の更新
     * @param {*} player 
     */
    updateQuadtreePosition(player) {
        this.quadtree.remove(player.position);
        this.quadtree.insert(player.position);
    }

    /**
     * プレイヤー位置の削除
     * @param {*} player 
     */
    removeQuadtreePosition(player) {
        this.quadtree.remove(player.position);
    }

    /**
     * プレイヤーの追加
     */
    onPhysicsUpdate() {
        this.clients.forEach(player => {
            player.onPhysicsUpdate();
        });
    }

    /**
     * 当たり判定
     * @param {*} rigidbody1 
     * @param {*} rigidbody2 
     */
    onRigidbodyCollision(rigidbody1, rigidbody2) {
        // if (rigidbody1 instanceof Bullet && rigidbody2 instanceof Player) {
        //     if (rigidbody1.owner != rigidbody2) {
        //         rigidbody2.onDamage(rigidbody1.damage);
        //         rigidbody1.onDestroy();
        //     }
        // }
    }

    /**
     * パケットのブロードキャスト
     * @param {*} packet 
     */
    broadcastPacket(packet) {
        this.clients.forEach(client => {
            client.sendPacket(packet);
        });
    }

    /**
     * チャットのブロードキャスト
     * @param {*} player 
     * @param {*} message 
     */
    addChat(player, message) {
        this.broadcastPacket(new AddChat(player.name, message));
    }

    /**
     * プレイヤーの追加
     * @param {*} player 
     */
    addPlayer(player) {
        this.clients.push(player);
        this.quadtree.insert(player.position);
    }

    /**
     * プレイヤーの削除
     * @param {*} player 
     */
    removePlayer(player) {
        this.clients.splice(this.clients.indexOf(player), 1);
    }

    /**
     * キャラクターの追加
     * @param {*} character 
     */
    addCharacter(character) {
        this.characters.push(character);
        this.quadtree.insert(character.position);
    }

    /**
     * キャラクターの削除
     * @param {*} character 
     */
    removeCharacter(character) {
        this.characters.splice(this.characters.indexOf(character), 1);
    }

    /**
     * 弾の追加
     * @param {*} bullet 
     */
    addBullet(bullet) {
        this.bullets.push(bullet);
        this.quadtree.insert(bullet.position);
    }

    /**
     * 弾の削除
     * @param {*} bullet 
     */
    removeBullet(bullet) {
        this.bullets.splice(this.bullets.indexOf(bullet), 1);
    }

    /**
     * 接続時の処理
     * @param {*} webSocket 
     */
    onConnection(webSocket) {
        // プレイヤーの生成
        const player = new Player(this, webSocket, this.getGenerateId());
        // プレイヤーの追加
        this.addPlayer(player);
        // 切断時の処理
        player.onDisconnect = () => {
            this.removePlayer(player);
            this.removeQuadtreePosition(player);
            player.isAlive = false;
        };
        // プレイヤーの位置の追加
        this.appendQuadtreePosition(player);
        this.logger.debug(`Player connected. (id: ${player.id})`);
    }

    /**
     * IDの生成
     * @returns 
     */
    getGenerateId() {
        return this.generateId++;
    }

    /**
     * 設定ファイルの読込
     * @returns 
     */
    readConfigText() {
        return fs.readFileSync("./Config.json", "utf8");
    }

    /**
     * CPU使用率の計算
     * @returns 
     */
    getCpuUsage() {
        return `${Math.round(os.loadavg()[0] * 100) / 100}%`;
    }

    /**
     * メモリ使用量の計算
     * @returns 
     */
    getMemoryUsage() {
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        return `${Math.round(used * 100) / 100}MB`;
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
}