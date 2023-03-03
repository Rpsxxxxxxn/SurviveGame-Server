module.exports = class Status {
    /**
     * ステータスのクラス
     * @param {*} hp 
     * @param {*} atk 
     * @param {*} def 
     * @param {*} spd 
     * @param {*} luk 
     */
    constructor(hp, atk, def, spd, luk) {
        this.hp = hp;
        this.atk = atk;
        this.def = def;
        this.spd = spd;
        this.luk = luk;
    }

    buff(status) {
        this.hp += status.hp;
        this.atk += status.atk;
        this.def += status.def;
        this.spd += status.spd;
        this.luk += status.luk;
    }

    debuff(status) {
        this.hp -= status.hp;
        this.atk -= status.atk;
        this.def -= status.def;
        this.spd -= status.spd;
        this.luk -= status.luk;
    }

    setValues(hp, atk, def, spd, luk) {
        this.hp = hp;
        this.atk = atk;
        this.def = def;
        this.spd = spd;
        this.luk = luk;
    }

    getValues() {
        return {
            hp: this.hp,
            atk: this.atk,
            def: this.def,
            spd: this.spd,
            luk: this.luk
        };
    }

    getHp() {
        return this.hp;
    }

    getAtk() {
        return this.atk;
    }

    getDef() {
        return this.def;
    }

    getSpd() {
        return this.spd;
    }

    getLuk() {
        return this.luk;
    }
}