module.exports = class NodeData {
    constructor(id, type, position, size) {
        this.id = id;
        this.type = type; // 0: player 1: enemy 2: bullet
        this.position = position;
        this.size = size;
        this.isAlive = true; // 生存状態
        this.quadTreeNode = null; // 4分木のノード
    }

    setAlive(isAlive) {
        this.isAlive = isAlive;
    }
}