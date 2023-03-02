const Rectangle = require("./Rectangle");

module.exports = class QuadTree {
    /**
     * 四分木を生成する
     * @param {*} boundary 
     * @param {*} capacity 
     */
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    /**
     * 四分木を分割する
     */
    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w / 2;
        let h = this.boundary.h / 2;

        let ne = new Rectangle(x + w, y - h, w, h);
        this.northeast = new QuadTree(ne, this.capacity);
        let nw = new Rectangle(x - w, y - h, w, h);
        this.northwest = new QuadTree(nw, this.capacity);
        let se = new Rectangle(x + w, y + h, w, h);
        this.southeast = new QuadTree(se, this.capacity);
        let sw = new Rectangle(x - w, y + h, w, h);
        this.southwest = new QuadTree(sw, this.capacity);

        this.divided = true;
    }


    /**
     * 四分木に点を挿入する
     * @param {*} point 
     * @returns 
     */
    insert(point) {
        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }

        if (!this.divided) {
            this.subdivide();
        }

        if (this.northeast.insert(point)) return true;
        if (this.northwest.insert(point)) return true;
        if (this.southeast.insert(point)) return true;
        if (this.southwest.insert(point)) return true;

        return false;
    }

    /**
     * 四分木から点を検索する
     * @param {*} range 
     * @param {*} found 
     * @returns 
     */
    query(range, found) {
        if (!found) {
            found = [];
        }

        if (!this.boundary.intersects(range)) {
            return found;
        }

        for (let point of this.points) {
            if (range.contains(point)) {
                found.push(point);
            }
        }

        if (this.divided) {
            this.northeast.query(range, found);
            this.northwest.query(range, found);
            this.southeast.query(range, found);
            this.southwest.query(range, found);
        }

        return found;
    }

    /**
     * 四分木から点を削除する
     * @param {*} point 
     * @returns 
     */
    remove(point) {
        if (!this.boundary.contains(point)) {
            return false;
        }

        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i].equals(point)) {
                this.points.splice(i, 1);
                return true;
            }
        }

        if (this.divided) {
            if (this.northeast.remove(point)) return true;
            if (this.northwest.remove(point)) return true;
            if (this.southeast.remove(point)) return true;
            if (this.southwest.remove(point)) return true;
        }

        return false;
    }
};