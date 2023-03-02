const fs = require("fs");
const Utils = require("./Utils");

module.exports = class Logger {
    constructor() {
        this._log = [];
        this.directory = './log/';
        this.filename = `${Utils.getYYYYMMDD()}.txt`;
        this.createLogFile();
    }

    /**
     * ログを出力する
     * @param {*} value 
     */
    log(value) {
        const message = `[INFO] ${value}`;
        this.appendFileLog(message)
        console.log(`\x1b[32m${message}`)
    }

    /**
     * 警告を出力する
     * @param {*} value 
     */
    warn(value) {
        const message = `[WARN] ${value}`;
        this.appendFileLog(message)
        console.log(`\x1b[33m${message}`)
    }

    /**
     * エラーを出力する
     * @param {*} value 
     */
    error(value) {
        const message = `[ERROR] ${value}`;
        this.appendFileLog(message)
        console.log(`\x1b[31m${message}`)
    }

    /**
     * デバッグ用のログを出力する
     * @param {*} value 
     */
    debug(value) {
        const message = `[DEBUG] ${value}`;
        this.appendFileLog(message)
        console.log(`\x1b[37m${message}`)
    }

    /**
     * ログをクリアする
     */
    clear() {
        this._log = [];
    }

    /**
     * ログファイルを作成する
     */
    createLogFile() {
        const path = this.getFilePath();
        const flg = 'r';
        try {
            fs.readFileSync(path, 'utf-8', flg);
        } catch (err) {
            if (err) {
                fs.writeFileSync(path, '');
                this.appendFileLog(err);
            }
        }
    }

    /**
     * ログファイルにメッセージを追加する
     * @param {*} message 
     */
    appendFileLog(message) {
        fs.appendFileSync(this.getFilePath(), `[${Utils.getYYYYMMDDHHMMSS()}]${message}` + '\r\n');
    }

    /**
     * ログファイルのパスを取得する
     * @returns 
     */
    getFilePath() {
        return this.directory + this.filename;
    }
}