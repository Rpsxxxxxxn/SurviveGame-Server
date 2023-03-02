module.exports = class Logger {
    constructor() {
        this._log = [];
    }

    appendSaveLogFile() {
        let blob = new Blob(this._log, { type: "text/plain;charset=utf-8" });
        saveAs(blob, "log.txt");
    }

    /**
     * ログを出力する
     * @param {*} value 
     */
    log(value) {
        const message = `[INFO] ${value}`;
        this._log.push(message);
        console.log(`\x1b[32m${message}`)
    }

    /**
     * 警告を出力する
     * @param {*} value 
     */
    warn(value) {
        const message = `[WARN] ${value}`;
        this._log.push(message);
        console.log(`\x1b[33m${message}`)
    }

    /**
     * エラーを出力する
     * @param {*} value 
     */
    error(value) {
        const message = `[ERROR] ${value}`;
        this._log.push(message);
        console.log(`\x1b[31m${message}`)
    }

    /**
     * デバッグ用のログを出力する
     * @param {*} value 
     */
    debug(value) {
        const message = `[DEBUG] ${value}`;
        this._log.push(message);
        console.log(`\x1b[37m${message}`)
    }

    /**
     * ログをクリアする
     */
    clear() {
        this._log = [];
    }
}