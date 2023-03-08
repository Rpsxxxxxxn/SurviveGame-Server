const ObjectNode = require("../common/ObjectNode");

module.exports = class NodeData {
    constructor(id, type, position, size) {
        this.id = id;
        this.type = type; // 0: player 1: enemy 2: bullet
        this.position = position;
        this.size = size;
        this.isAlive = true; // 生存状態
        this.quadTreeNode = null; // 4分木のノード
    }

    getAlive() {
        return this.isAlive;
    }

    setAlive(isAlive) {
        this.isAlive = isAlive;
    }

    getQuadTreeNode() {
        return this.quadTreeNode;
    }

    setQuadTreeNode(quadTreeNode) {
        this.quadTreeNode = quadTreeNode;
    }

    checkUpdateQuadTreeNode() {
        return this.quadTreeNode.x === this.position.x - this.size &&
        this.quadTreeNode.y === this.position.y - this.size &&
        this.quadTreeNode.w === this.size * 2 &&
        this.quadTreeNode.h === this.size * 2;
    }

    getNewQuadTreeNode() {
        return new ObjectNode(this.position.x - this.size, this.position.y - this.size, this.size * 2, this.size * 2, this);
    }
}