module.exports = class Utils {
    /**
     * 乱数を生成する
     * @param {*} min 
     * @param {*} max 
     * @returns 
     */
    static random(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * 数値かどうかを判定する
     * @param {*} value 
     * @returns 
     */
    static isNumber(value) {
        return typeof value === 'number';
    }

    /**
     * 文字列かどうかを判定する
     * @param {*} value 
     * @returns 
     */
    static isString(value) {
        return typeof value === 'string';
    }

    /**
     * booleanかどうかを判定する
     * @param {*} value 
     * @returns 
     */
    static isBoolean(value) {
        return typeof value === 'boolean';
    }

    /**
     * 関数かどうかを判定する
     * @param {*} value 
     * @returns 
     */
    static isFunction(value) {
        return typeof value === 'function';
    }

    /**
     * ラジアンから度数に変換する
     * @param {*} radian 
     * @returns 
     */
    static radianToDegree(radian) {
        return radian * 180 / Math.PI;
    }

    /**
     * 度数からラジアンに変換する
     * @param {*} degree 
     * @returns 
     */
    static degreeToRadian(degree) {
        return degree * Math.PI / 180;
    }

    /**
     * nullまたはundefinedまたは空文字かどうかを判定する
     * @param {*} value 
     * @returns 
     */
    static isNullOrEmpty(value) {
        return value === null || value === undefined || value === '';
    }

    /**
     * nullまたはundefinedまたは空文字でないかどうかを判定する
     * @param {*} value 
     * @returns 
     */
    static isNotNullOrEmpty(value) {
        return !this.isNullOrEmpty(value);
    }

    /**
     * nullまたはundefinedかどうかを判定する
     * @param {*} value 
     * @returns 
     */
    static isEmpty(value) {
        return value === null || value === undefined;
    }

    /**
     * nullまたはundefinedでないかどうかを判定する
     * @param {*} value 
     * @returns 
     */
    static isNotEmpty(value) {
        return !this.isEmpty(value);
    }
}