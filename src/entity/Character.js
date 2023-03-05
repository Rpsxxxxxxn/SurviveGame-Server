const Rectangle = require("../common/Rectangle");
const Vector2 = require("../common/Vector2");

module.exports = class Character {
    constructor(parent, type, id) {
        this.parent = parent; // 親クラス
        this.type = type; // タイプ (0: プレイヤー, 1: 敵)
        this.id = id; // ID
        this.name = "テスト名"; // 名前
        this.position = new Vector2(0, 0); // 座標
        this.direction = 0; // 0: up, 1: right, 2: down, 3: left
        this.isAlive = true; // 生存状態
        this.score = 0;
        this.size = 24; // サイズ (半径)

        // ステータス
        this.hp = 100; // 体力
        this.str = 10; // 物理攻撃力
        this.vit = 5; // 防御力
        this.dex = 1; // 攻撃速度
        this.int = 1; // 魔法攻撃力
        this.luk = 1; // クリティカル率
        this.spd = 1; // 移動速度

        this.weapons = []; // 武器
        this.viewerBox = new Rectangle(0, 0, 100, 100); // 視界範囲
        this.quadTreeNode = null; // 4分木のノード
    }

    physicsUpdate() {
        this.position.add(Vector2.fromAngle(this.velocity).mulScalar(10));
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
        this.viewerBox.x = this.position.x - this.size * 2;
        this.viewerBox.y = this.position.y - this.size * 2;
        this.viewerBox.w = this.position.x + this.size * 2;
        this.viewerBox.h = this.position.y + this.size * 2;
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
}