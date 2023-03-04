const Vector2 = require("../common/Vector2");

module.exports = class ExpRamune {
    constructor() {
        this.position = new Vector2(0, 0);
        this.size = 32;
        this.isAlive = true;
    }

    directionMove(direction) {
        this.position.x += Math.cos(direction) * 1;
        this.position.y += Math.sin(direction) * 1;
    }

    trackingMove(target) {
        const distance = this.position.distance(target.position);
        if (distance < 1) return;
        this.directionMove(this.position.direction(target.position));
    }
}