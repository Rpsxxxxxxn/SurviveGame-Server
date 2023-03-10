const Rectangle = require("../common/Rectangle");
const StopWatch = require("../common/StopWatch");
const Vector2 = require("../common/Vector2");
const NodeData = require("./NodeData");

module.exports = class Character extends NodeData {
    constructor(parent, type, id, position, size) {
        super(id, type, position, size);
        this.parent = parent; // 親クラス
        this.name = ""; // 名前
        this.score = 0; // スコア
        this.direction = 0; // Math.PI * 4 * Direction
        this.actionStopWatch = new StopWatch(); // アクションのクールダウン
        this.actionStopWatch.start();

        this.level = 1;
        this.hp = 100; // 体力
        this.str = 10; // 物理攻撃力
        this.vit = 5; // 防御力
        this.dex = 1; // 攻撃速度
        this.int = 1; // 魔法攻撃力
        this.luk = 0.1; // クリティカル率
        this.spd = 3; // 移動速度

        this.viewerBox = new Rectangle(0, 0, 100, 100); // 視界範囲
    }

    levelUpStatus(gameLevel) {
        this.level = gameLevel;
        this.hp = gameLevel * 100;
        this.str = gameLevel * 10;
        this.vit = gameLevel * 5;

        this.dex = gameLevel * .1 > 100 ? 100 : gameLevel * .1;
        this.int = gameLevel * 1;

        const luk = ~~(gameLevel / 10) === 0 ? 1 : ~~(gameLevel / 10);
        this.luk = luk * 0.1 > 0.5 ? 0.5 : luk * 0.1;
    }

    /**
     * クールタイムのチェック
     * @returns 
     */
    checkActionCoolTime() {
        return this.actionStopWatch.getElapsedTime() < 1000 / this.dex;
    }

    /**
     * クールタイムのリセット
     */
    resetActionCoolTime() {
        this.actionStopWatch.reset();
        this.actionStopWatch.start();
    }

    /**
     * 体力の減少
     * @param {*} damage 
     */
    reduceHP(damage) {
        this.hp -= damage;
        if (this.hp < 0) {
            this.hp = 0;
            this.isAlive = false;
        }
    }

    /**
     * クリティカルヒットかどうかを判定する
     * @returns 
     */
    isCliticalHit() {
        return Math.random() < this.luk;
    }

    /**
     * スコアの加算
     * @param {*} score 
     */
    onAddScore(score) {
        this.score += score;
    }

    /**
     * フレーム更新
     */
    onUpdatePhysics() {
        this.updateViewerBox();
    }

    /**
     * 方向に移動する
     * @param {*} direction 
     */
    directionMove(direction) {
        this.position.x += Math.cos(direction) * this.spd;
        this.position.y += Math.sin(direction) * this.spd;
    }

    /**
     * 目標に向かって移動する
     * @param {*} target 
     * @returns 
     */
    targetTrackingMove(target) {
        const distance = this.position.distance(target.position);
        if (distance < 1) return;
        this.directionMove(this.position.direction(target.position));
    }

    /**
     * 移動制限
     * @param {*} border 
     */
    positionMoveLimit(border) {
        if (this.position.x < border.x) this.position.x = border.x;
        if (this.position.y < border.y) this.position.y = border.y;
        if (this.position.x > border.w - this.size * 2) this.position.x = border.w - this.size * 2;
        if (this.position.y > border.h - this.size * 2) this.position.y = border.h - this.size * 2;
    }

    /**
     * 視界範囲の更新
     */
    updateViewerBox() {
        this.viewerBox.x = this.position.x;
        this.viewerBox.y = this.position.y;
        this.viewerBox.w = 600;
        this.viewerBox.h = 600;
    }

    /**
     * 視界範囲の設定
     * @param {*} minX 
     * @param {*} minY 
     * @param {*} maxX 
     * @param {*} maxY 
     */
    setViewerBox(x, y, w, h) {
        this.viewerBox.x = x;
        this.viewerBox.y = y;
        this.viewerBox.w = w;
        this.viewerBox.h = h;
    }

    /**
     * 視界範囲の取得
     * @returns 
     */
    getViewerBox() {
        return this.viewerBox;
    }

    /**
     * 視界範囲の中心座標の取得
     * @returns 
     */
    getViewerBoxCenter() {
        return new Vector2((this.viewerBox.minX + this.viewerBox.maxX) / 2, (this.viewerBox.minY + this.viewerBox.maxY) / 2);
    }

    /**
     * サイズの二乗を取得する
     * @returns 
     */
    getSquaredSize() {
        return this.size * this.size;
    }

    /**
     * 4分木のノードを設定する
     * @returns 
     */
    getScore() {
        return this.score;
    }
}