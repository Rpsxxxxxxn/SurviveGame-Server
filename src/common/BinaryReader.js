module.exports = class BinaryReader {
    constructor(buffer) {
        this.view = Buffer.from(buffer);
        this.offset = 0;
    }

    /**
     * 8bit符号付き整数を取得する
     * @returns 
     */
    getInt8() {
        let value = this.view.readInt8(this.offset);
        this.offset += 1;
        return value;
    }

    /**
     * 8bit符号なし整数を取得する
     * @returns 
     */
    getUint8() {
        let value = this.view.readUint8(this.offset);
        this.offset += 1;
        return value;
    }

    /**
     * 16bit符号付き整数を取得する
     * @returns 
     */
    getInt16() {
        let value = this.view.readInt16LE(this.offset);
        this.offset += 2;
        return value;
    }

    /**
     * 16bit符号なし整数を取得する
     * @returns 
     */
    getUint16() {
        let value = this.view.readUint16LE(this.offset);
        this.offset += 2;
        return value;
    }

    /**
     * 32bit符号付き整数を取得する
     * @returns 
     */
    getInt32() {
        let value = this.view.readInt32LE(this.offset);
        this.offset += 4;
        return value;
    }

    /**
     * 32bit符号なし整数を取得する
     * @returns 
     */
    getUint32() {
        let value = this.view.readUint32LE(this.offset);
        this.offset += 4;
        return value;
    }

    /**
     * 32bit浮動小数点数を取得する
     * @returns 
     */
    getFloat32() {
        let value = this.view.readFloatLE(this.offset);
        this.offset += 4;
        return value;
    }

    /**
     * 64bit浮動小数点数を取得する
     * @returns 
     */
    getFloat64() {
        let value = this.view.readDoubleLE(this.offset);
        this.offset += 8;
        return value;
    }

    /**
     * 文字列を取得する
     * @returns
     */
    getString() {
        let length = this.getUint16();
        let value = '';
        for (let i = 0; i < length; i++) {
            value += String.fromCharCode(this.getUint8());
        }
        return value;
    }

    getUTF8String() {
        let length = this.getUint16();
        let value = this.view.toString('utf8', this.offset, this.offset + length);
        this.offset += length;
        return value;
    }

    /**
     * バッファの先頭に戻す
     */
    reset() {
        this.offset = 0;
    }
}