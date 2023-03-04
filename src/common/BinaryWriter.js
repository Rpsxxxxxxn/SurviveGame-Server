module.exports = class BinaryWriter {
    constructor() {
        this.offset = 0;
        this.buffer = Buffer.allocUnsafe(1048576);
    }

    /**
     * 8bit符号付き整数をセットする
     * @param {*} value 
     */
    setInt8(value) {
        this.buffer.writeInt8(value, this.offset++);
    }

    /**
     * 8bit符号なし整数をセットする
     * @param {*} value 
     */
    setUint8(value) {
        this.buffer.writeUInt8(value, this.offset++);
    }

    /**
     * 16bit符号付き整数をセットする
     * @param {*} value 
     */
    setInt16(value) {
        this.buffer.writeInt16LE(value, this.offset);
        this.offset += 2;
    }

    /**
     * 16bit符号なし整数をセットする
     * @param {*} value 
     */
    setUint16(value) {
        this.buffer.writeUInt16LE(value, this.offset);
        this.offset += 2;
    }

    /**
     * 32bit符号付き整数をセットする
     * @param {*} value 
     */
    setInt32(value) {
        this.buffer.writeInt32LE(value, this.offset);
        this.offset += 4;
    }

    /**
     * 32bit符号なし整数をセットする
     * @param {*} value 
     */
    setUint32(value) {
        this.buffer.writeUInt32LE(value, this.offset);
        this.offset += 4;
    }

    /**
     * 32bit浮動小数点数をセットする
     * @param {*} value 
     */
    setFloat32(value) {
        this.buffer.writeFloatLE(value, this.offset);
        this.offset += 4;
    }

    /**
     * 64bit浮動小数点数をセットする
     * @param {*} value 
     */
    setFloat64(value) {
        this.buffer.writeDoubleLE(value, this.offset);
        this.offset += 8;
    }

    /**
     * 文字列をセットする
     * @param {*} value 
     */
    setString(value) {
        this.setUint16(value.length);
        for (let i = 0; i < value.length; i++) {
            this.setUint16(value.charCodeAt(i));
        }
    }

    /**
     * UTF-8文字列をセットする
     * @param {*} value 
     */
    setUTF8String(value) {
        this.setUint16(Buffer.byteLength(value));
        this.buffer.write(value, this.offset);
        this.offset += Buffer.byteLength(value);
    }

    /**
     * バッファをセットする
     * @returns 
     */
    toBuffer() {
        const buffer = Buffer.allocUnsafe(this.offset);
        this.buffer.copy(buffer, 0, 0, this.offset);
        return buffer;
    }
}