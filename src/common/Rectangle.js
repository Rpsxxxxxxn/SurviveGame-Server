module.exports = class Rectangle {
    /**
     * 四角形を生成する
     * @param {*} x 
     * @param {*} y 
     * @param {*} w 
     * @param {*} h 
     */
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    /**
     * 四角形の中に点が含まれているかどうかを判定する
     * @param {*} point 
     * @returns 
     */
    contains(point) {
        return point.x >= this.x - this.w &&
               point.x <= this.x + this.w &&
               point.y >= this.y - this.h &&
               point.y <= this.y + this.h;
    }

    /**
     * 四角形が他の四角形と交差しているかどうかを判定する
     * @param {*} range 
     * @returns 
     */
    intersects(range) {
        return !(range.x - range.w > this.x + this.w ||
                 range.x + range.w < this.x - this.w ||
                 range.y - range.h > this.y + this.h ||
                 range.y + range.h < this.y - this.h);
    }

    /**
     * 四角形が他の四角形と等しいかどうかを判定する
     * @param {*} rect 
     * @returns 
     */
    equals(rect) {
        return this.x === rect.x && this.y === rect.y && this.w === rect.w && this.h === rect.h;
    }
}