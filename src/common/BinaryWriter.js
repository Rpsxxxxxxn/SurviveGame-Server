module.exports = class BinaryWriter {
    constructor() {
        this.offset = 0;
        this.buffer = Buffer.allocUnsafe(1048576);
    }

    setInt8(value) {
        this.buffer.writeInt8(value, this.offset++);
    }

    setUint8(value) {
        this.buffer.writeUInt8(value, this.offset++);
    }

    setInt16(value) {
        this.buffer.writeInt16LE(value, this.offset);
        this.offset += 2;
    }

    setUint16(value) {
        this.buffer.writeUInt16LE(value, this.offset);
        this.offset += 2;
    }

    setInt32(value) {
        this.buffer.writeInt32LE(value, this.offset);
        this.offset += 4;
    }

    setUint32(value) {
        this.buffer.writeUInt32LE(value, this.offset);
        this.offset += 4;
    }

    setFloat32(value) {
        this.buffer.writeFloatLE(value, this.offset);
        this.offset += 4;
    }

    setFloat64(value) {
        this.buffer.writeDoubleLE(value, this.offset);
        this.offset += 8;
    }

    setString(value) {
        this.setUint16(value.length);
        for (const element of value) {
            this.setUint16(encodeURIComponent(value.charCodeAt(element)));
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