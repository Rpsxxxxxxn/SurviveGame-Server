const fs = require("fs");
const Utils = require("./Utils");

module.exports = class Logger {
    constructor() {
        this._log = [];
        this.createLogFile('./log/log.txt');
        this.createLogFile('./log/warn.txt');
        this.createLogFile('./log/error.txt');
        this.createLogFile('./log/debug.txt');
    }

    /**
     * ログを出力する
     * @param {*} value 
     */
    log(value) {
        const message = `[INFO] ${value}`;
        this.appendFileLog('./log/log.txt', message);
        console.log(`\x1b[32m${message}`)
    }

    /**
     * 警告を出力する
     * @param {*} value 
     */
    warn(value) {
        const message = `[WARN] ${value}`;
        this.appendFileLog('./log/warn.txt', message);
        console.log(`\x1b[33m${message}`)
    }

    /**
     * エラーを出力する
     * @param {*} value 
     */
    error(value) {
        const message = `[ERROR] ${value}`;
        this.appendFileLog('./log/error.txt', message);
        console.log(`\x1b[31m${message}`)
    }

    /**
     * デバッグ用のログを出力する
     * @param {*} value 
     */
    debug(value) {
        const message = `[DEBUG] ${value}`;
        this.appendFileLog('./log/debug.txt', message);
        console.log(`\x1b[37m${message}`)
    }

    /**
     * ログファイルを作成する
     */
    createLogFile(path) {
        const flg = 'r';
        try {
            fs.readFileSync(path, 'utf-8', flg);
        } catch (err) {
            if (err) {
                fs.writeFileSync(path, '');
                this.error(err);
            }
        }
    }

    /**
     * ログファイルにメッセージを追加する
     * @param {*} message 
     */
    appendFileLog(path, message) {
        fs.appendFileSync(path, `[${Utils.getYYYYMMDDHHMMSS()}]${message}` + '\r\n');
    }
}