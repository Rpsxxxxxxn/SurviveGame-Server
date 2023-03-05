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

    /**
     * 現在の日付を取得する
     * @returns YYYY-MM-DD
     */
    static getYYYYMMDD() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * 現在の日時を取得する
     * @returns YYYY-MM-DD HH:MM:SS
     */
    static getYYYYMMDDHHMMSS() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    /**
     * 16進数からRGBに変換する
     * @param {*} hex 
     * @returns 
     */
    static getHexToRgb(hex) {
        const rgb = [];
        for (let i = 0; i < 3; i++) {
            rgb.push(parseInt(hex.substr(i * 2, 2), 16));
        }
        return rgb;
    }

    /**
     * RGBから16進数に変換する
     * @param {*} rgb 
     * @returns 
     */
    static getRgbToHex(rgb) {
        let hex = '#';
        for (let i = 0; i < 3; i++) {
            hex += ('0' + rgb[i].toString(16)).slice(-2);
        }
        return hex;
    }

    /**
     * 配列の最大値を取得する
     * @param {*} array 
     * @returns 
     */
    static getArrayMax(array) {
        return array.reduce((a, b) => Math.max(a, b));
    }

    /**
     * 配列の最小値を取得する
     * @param {*} array 
     * @returns 
     */
    static getArrayMin(array) {
        return array.reduce((a, b) => Math.min(a, b));
    }

}