module.exports = class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * ベクトルの加算
     * @param {*} vector 
     */
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    addScalar(scalar) {
        this.x += scalar;
        this.y += scalar;
        return this;
    }

    /**
     * ベクトルの減算
     * @param {*} vector 
     */
    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    subScalar(scalar) {
        this.x -= scalar;
        this.y -= scalar;
        return this;
    }

    /**
     * ベクトルの乗算
     * @param {*} vector 
     */
    mul(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
        return this;
    }

    mulScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * ベクトルの除算
     * @param {*} vector 
     */
    div(vector) {
        this.x /= vector.x;
        this.y /= vector.y;
        return this;
    }

    divScalar(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    /**
     * ベクトルの大きさを求める
     * @returns 
     */
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * ベクトルの正規化
     */
    normalize() {
        let mag = this.mag();
        this.x /= mag;
        this.y /= mag;
        return this;
    }

    /**
     * ベクトルの大きさを制限する
     * @param {*} max 
     */
    limit(max) {
        if (this.mag() > max) {
            this.normalize();
            this.mul(max);
        }
        return this;
    }

    /**
     * ベクトルの大きさを設定する
     * @param {*} mag 
     */
    setMag(mag) {
        this.normalize();
        this.mul(mag);
        return this;
    }

    /**
     * ベクトルの角度を求める
     * @returns 
     */
    heading() {
        return Math.atan2(this.y, this.x);
    }

    /**
     * ベクトルの角度を設定する
     * @param {*} angle 
     */
    rotate(angle) {
        let newHeading = this.heading() + angle;
        let mag = this.mag();
        this.x = Math.cos(newHeading) * mag;
        this.y = Math.sin(newHeading) * mag;
        return this;
    }

    /**
     * 距離を求める
     * @param {*} vector 
     * @returns 
     */
    distance(vector) {
        let dx = vector.x - this.x;
        let dy = vector.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * ベクトルの角度を設定する
     * @param {*} vector 
     * @returns 
     */
    direction(vector) {
        let dx = vector.x - this.x;
        let dy = vector.y - this.y;
        return Math.atan2(dy, dx);
    }

    /**
     * ベクトルのコピー
     * @returns 
     */
    copy() {
        return new Vector2(this.x, this.y);
    }

    /**
     * 逆方向の角度を求める
     * @param {*} vector 
     * @returns 
     */
    inverseDirection(vector) {
        let dx = vector.x - this.x;
        let dy = vector.y - this.y;
        return Math.atan2(-dy, -dx);
    }

    /**
     * ベクトルの角度を設定する
     * @param {*} vector1 
     * @param {*} vector2 
     * @returns 
     */
    static direction(vector1, vector2) {
        let dx = vector2.x - vector1.x;
        let dy = vector2.y - vector1.y;
        return new Vector2(dx, dy);
    }

    /**
     * 足し算
     * @param {*} vector1 
     * @param {*} vector2 
     * @returns 
     */
    static add(vector1, vector2) {
        return new Vector2(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    /**
     * 引き算
     * @param {*} vector1 
     * @param {*} vector2 
     * @returns 
     */
    static sub(vector1, vector2) {
        return new Vector2(vector1.x - vector2.x, vector1.y - vector2.y);
    }

    /**
     * 掛け算
     * @param {*} vector1 
     * @param {*} vector2 
     * @returns 
     */
    static mul(vector1, vector2) {
        return new Vector2(vector1.x * vector2.x, vector1.y * vector2.y);
    }

    /**
     * 減算
     * @param {*} vector1 
     * @param {*} vector2 
     * @returns 
     */
    static div(vector1, vector2) {
        return new Vector2(vector1.x / vector2.x, vector1.y / vector2.y);
    }

    /**
     * ベクトルの大きさを求める
     * @param {*} vector 
     * @returns 
     */
    static mag(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }

    /**
     * ベクトルの正規化
     * @param {*} vector 
     * @returns 
     */
    static normalize(vector) {
        let mag = Vector2.mag(vector);
        return new Vector2(vector.x / mag, vector.y / mag);
    }

    /**
     * ベクトルの大きさを制限する
     * @param {*} vector 
     * @param {*} max 
     */
    static limit(vector, max) {
        if (Vector2.mag(vector) > max) {
            Vector2.normalize(vector);
            Vector2.mul(vector, max);
        }
    }

    /**
     * ベクトルの大きさを設定する
     * @param {*} vector 
     * @param {*} mag 
     */
    static setMag(vector, mag) {
        Vector2.normalize(vector);
        Vector2.mul(vector, mag);
    }

    /**
     * ベクトルの角度を求める
     * @param {*} vector 
     * @returns 
     */
    static heading(vector) {
        return Math.atan2(vector.y, vector.x);
    }

    /**
     * ベクトルの角度を設定する
     * @param {*} vector 
     * @param {*} angle 
     */
    static rotate(vector, angle) {
        let newHeading = Vector2.heading(vector) + angle;
        let mag = Vector2.mag(vector);
        vector.x = Math.cos(newHeading) * mag;
        vector.y = Math.sin(newHeading) * mag;
    }

    /**
     * ベクトルの距離を求める
     * @param {*} vector1 
     * @param {*} vector2 
     * @returns 
     */
    static distance(vector1, vector2) {
        return Vector2.mag(Vector2.sub(vector1, vector2));
    }

    /**
     * ベクトルの角度を求める
     * @param {*} vector1 
     * @param {*} vector2 
     * @returns 
     */
    static angleBetween(vector1, vector2) {
        return Math.acos(Vector2.dot(vector1, vector2) / (Vector2.mag(vector1) * Vector2.mag(vector2)));
    }

    /**
     * ベクトルの内積を求める
     * @param {*} vector1 
     * @param {*} vector2 
     * @returns 
     */
    static dot(vector1, vector2) {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }

    /**
     * ベクトルの外積を求める
     * @param {*} vector1 
     * @param {*} vector2 
     * @param {*} amount 
     * @returns 
     */
    static lerp(vector1, vector2, amount) {
        return Vector2.add(vector1, Vector2.mul(Vector2.sub(vector2, vector1), amount));
    }

    /**
     * ベクトルの外積を求める
     * @param {*} vector1 
     * @param {*} vector2 
     * @returns 
     */
    static cross(vector1, vector2) {
        return vector1.x * vector2.y - vector1.y * vector2.x;
    }

    /**
     * ベクトルの角度を求める
     * @param {*} angle 
     * @returns 
     */
    static fromAngle(angle) {
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    /**
     * ベクトルをランダムに生成する
     * @returns 
     */
    static random2D() {
        return Vector2.fromAngle(Math.random() * Math.PI * 2);
    }

    /**
     * ベクトルをランダムに生成する
     * @returns 
     */
    static random() {
        return new Vector2(Math.random(), Math.random());
    }
}