const Vector2 = require("../common/Vector2");

module.exports = class Character {
    constructor(parent, id) {
        this.parent = parent; // 親クラス
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
        this.viewerBox = { minX: 0, minY: 0, maxX: 0, maxY: 0 }; // 視界範囲
        this.quadTreeNode = null; // 4分木のノード
    }

    /**
     * 方向に移動する
     * @param {*} direction 
     */
    directionMove(direction) {
        this.position.x += Math.cos(direction) * 1;
        this.position.y += Math.sin(direction) * 1;
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
     * 弾の衝突判定
     * @param {*} bullet 
     * @returns 
     */
    checkBulletCollision(bullet) {
        const distance = this.position.distance(bullet.position);
        if (distance < 1) {
            this.hp -= bullet.damage;
            if (this.hp <= 0) {
                this.isAlive = false;
            }
            return true;
        }
        return false;
    }

    /**
     * 円形の衝突判定
     * @param {*} target 
     * @returns 
     */
    circleRigidbody(target) {
        const distance = this.position.distance(target.position);
        if (distance < 1) return;
        const direction = this.position.direction(target.position);
        const force = 1 / distance;
        this.position.x += Math.cos(direction) * force;
        this.position.y += Math.sin(direction) * force;
    }

    /**
     * 視界範囲の更新
     * @param {*} query 
     * @returns 
     */
    updateViewerBoxFilter(query) {
        this.viewerBox.minX = this.position.x - query.range;
        this.viewerBox.minY = this.position.y - query.range;
        this.viewerBox.maxX = this.position.x + query.range;
        this.viewerBox.maxY = this.position.y + query.range;

        if (this.viewerBox.minX < 0) this.viewerBox.minX = 0;
        if (this.viewerBox.minY < 0) this.viewerBox.minY = 0;
        if (this.viewerBox.maxX > 100) this.viewerBox.maxX = 100;
        if (this.viewerBox.maxY > 100) this.viewerBox.maxY = 100;

        return this.viewerBox;
    }

    /**
     * 視界範囲の更新
     */
    updateViewerBox() {
        this.viewerBox.minX = this.position.x - 0.5;
        this.viewerBox.minY = this.position.y - 0.5;
        this.viewerBox.maxX = this.position.x + 0.5;
        this.viewerBox.maxY = this.position.y + 0.5;
    }

    /**
     * 視界範囲の設定
     * @param {*} minX 
     * @param {*} minY 
     * @param {*} maxX 
     * @param {*} maxY 
     */
    setViewerBox(minX, minY, maxX, maxY) {
        this.viewerBox.minX = minX;
        this.viewerBox.minY = minY;
        this.viewerBox.maxX = maxX;
        this.viewerBox.maxY = maxY;
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

    getSquaredSize() {
        return this.size * this.size;
    }
}