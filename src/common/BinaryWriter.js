module.exports = class BinaryWriter {
    constructor() {
        this.buffer = new ArrayBuffer(0);
        this.view = new DataView(this.buffer);
        this.offset = 0;
    }

    setInt8(value) {
        this.resize(1);
        this.view.setInt8(this.offset, value);
        this.offset += 1;
    }

    setUint8(value) {
        this.resize(1);
        this.view.setUint8(this.offset, value);
        this.offset += 1;
    }

    setInt16(value) {
        this.resize(2);
        this.view.setInt16(this.offset, value);
        this.offset += 2;
    }

    setUint16(value) {
        this.resize(2);
        this.view.setUint16(this.offset, value);
        this.offset += 2;
    }

    setInt32(value) {
        this.resize(4);
        this.view.setInt32(this.offset, value);
        this.offset += 4;
    }

    setUint32(value) {
        this.resize(4);
        this.view.setUint32(this.offset, value);
        this.offset += 4;
    }

    setFloat32(value) {
        this.resize(4);
        this.view.setFloat32(this.offset, value);
        this.offset += 4;
    }

    setFloat64(value) {
        this.resize(8);
        this.view.setFloat64(this.offset, value);
        this.offset += 8;
    }

    setString(value) {
        this.resize(2 + value.length);
        this.setUint16(value.length);
        for (let i = 0; i < value.length; i++) {
            this.setUint8(value.charCodeAt(i));
        }
    }

    resize(size) {
        let newBuffer = new ArrayBuffer(this.buffer.byteLength + size);
        let newView = new DataView(newBuffer);
        for (let i = 0; i < this.buffer.byteLength; i++) {
            newView.setUint8(i, this.view.getUint8(i));
        }
        this.buffer = newBuffer;
        this.view = newView;
    }
}