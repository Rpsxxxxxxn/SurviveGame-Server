module.exports = class StopWatch {
    constructor() {
        this.startTime = 0;
        this.endTime = 0;
        this.isRunning = false;
    }

    /**
     * タイマーを開始する
     */
    start() {
        this.startTime = Date.now();
        this.isRunning = true;
    }

    /**
     * タイマーを停止する
     */
    stop() {
        this.endTime = Date.now();
        this.isRunning = false;
    }

    /**
     * 経過時間を取得する
     * @returns 
     */
    getElapsedTime() {
        if (this.isRunning) {
            return Date.now() - this.startTime;
        } else {
            return this.endTime - this.startTime;
        }
    }

    getDeltaTime() {
        return this.getElapsedTime() / 1000;
    }

    /**
     * タイマーをリセットする
     */
    reset() {
        this.startTime = 0;
        this.endTime = 0;
        this.isRunning = false;
    }

    /**
     * タイマーを表示用にフォーマットする (HH:MM:SS.mmm)
     * @returns 
     */
    getDisplayTime() {
        let time = this.getElapsedTime();
        let ms = time % 1000;
        time = (time - ms) / 1000;
        let s = time % 60;
        time = (time - s) / 60;
        let m = time % 60;
        let h = (time - m) / 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
    }
}