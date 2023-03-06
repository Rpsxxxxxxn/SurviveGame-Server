const NodeData = require("./NodeData");

module.exports = class StatusUPItem extends NodeData {
    constructor(id, type, position, size) {
        this.id = id;
        this.type = type; // 0: HP 1: MP 2: ATK 3: DEF 4: SPD
        this.position = position;
        this.size = size;
    }
}