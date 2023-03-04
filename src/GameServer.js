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

module.exports = class GameServer {
    constructor() {
        this.logger = new Logger();
        this.config = JSON.parse(this.readConfigText());
        this.command = new Command(this);
        this.stopWatch = new StopWatch();
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
        if (this.checkGameEnd()) {
            this.stopWatch.stop();
            this.logger.log("Game end.");
        }

        this.objectUpdate();

        this.broadcastPacket(new UpdateCharacters(this.characters));
        
        this.calcDeltaTime();
        this.calcFrameRate();
        this.checkDeltaTime();
        this.checkFrameRate();

        this.broadcastPacket(new UpdateServerUsage(
            this.getCpuUsage(),
            this.getMemoryUsage(),
            this.deltaTime,
            this.frameRate));
        setTimeout(this.mainloop.bind(this), this.config.ServerLoopInterval);
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
        this.players.forEach(player => player.update());
    }

    /**
     * プレイヤー位置の追加
     * @param {*} character 
     */
    appendQuadtreePosition(character) {
        this.quadtree.insert(new Rectangle(
            character.position.x - character.size,
            character.position.y - character.size,
            character.size * 2,
            character.size * 2));
    }

    /**
     * プレイヤーの位置の更新
     * @param {*} character 
     */
    updateQuadtreePosition(character) {
        this.appendQuadtreePosition(character);
        this.removeQuadtreePosition(character);
    }

    /**
     * プレイヤー位置の削除
     * @param {*} character 
     */
    removeQuadtreePosition(character) {
        this.quadtree.remove(new Rectangle(
            character.position.x - character.size,
            character.position.y - character.size,
            character.size * 2,
            character.size * 2));
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
        this.appendQuadtreePosition(character);
    }

    /**
     * 弾の削除
     * @param {*} bullet 
     */
    removeBullet(bullet) {
        this.bullets.splice(this.bullets.indexOf(bullet), 1);
        this.removeQuadtreePosition(character);
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
}