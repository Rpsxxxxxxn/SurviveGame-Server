const Rectangle = require("./Rectangle");

module.exports = class ObjectNode extends Rectangle {
    /**
     * コンストラクタ
     * @param {*} x 
     * @param {*} y 
     * @param {*} w 
     * @param {*} h 
     * @param {*} object 
     */
    constructor(x, y, w, h, object) {
        super(x, y, w, h);
        this.object = object;
    }
}