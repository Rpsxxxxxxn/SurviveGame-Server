const Utils = require("../common/Utils");
const Vector2 = require("../common/Vector2");

module.exports = class DamageText {
    constructor(x, y, text, color) {
        this.position = new Vector2(x, y);
        this.text = text;
        this.color = Utils.getHexToRgb(color);
    }

    getColorToRGB() {
        return {
            r: this.color[0],
            g: this.color[1],
            b: this.color[2]
        }
    }
}