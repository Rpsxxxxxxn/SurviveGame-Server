const Rectangle = require("./Rectangle");

module.exports = class ObjectNode extends Rectangle {
    constructor(x, y, w, h, object) {
        super(x, y, w, h);
        this.object = object;
    }
}