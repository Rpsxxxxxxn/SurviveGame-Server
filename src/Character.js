const Vector2 = require("./common/Vector2");

module.exports = class Character {
    constructor(id) {
        this.id = id; // ID
        this.name = ""; // 名前
        this.position = new Vector2(0, 0); // 座標
        this.direction = 0; // 0: up, 1: right, 2: down, 3: left
        this.isAlive = false; // 生存状態
        
        // ステータス
        this.hp = 100; // 体力
        this.str = 1; // 物理攻撃力
        this.vit = 1; // 防御力
        this.dex = 1; // 攻撃速度
        this.int = 1; // 魔法攻撃力
        this.luk = 1; // クリティカル率
        this.spd = 1; // 移動速度

        this.weapons = []; // 武器
        this.viewerBox = { minX: 0, minY: 0, maxX: 0, maxY: 0 }; // 視界範囲
    }


    updateViewerBox() {
        this.viewerBox.minX = this.position.x - 0.5;
        this.viewerBox.minY = this.position.y - 0.5;
        this.viewerBox.maxX = this.position.x + 0.5;
        this.viewerBox.maxY = this.position.y + 0.5;
    }

    setViewerBox(minX, minY, maxX, maxY) {
        this.viewerBox.minX = minX;
        this.viewerBox.minY = minY;
        this.viewerBox.maxX = maxX;
        this.viewerBox.maxY = maxY;
    }

    getViewerBox() {
        return this.viewerBox;
    }

    getViewerBoxCenter() {
        return new Vector2((this.viewerBox.minX + this.viewerBox.maxX) / 2, (this.viewerBox.minY + this.viewerBox.maxY) / 2);
    }
}