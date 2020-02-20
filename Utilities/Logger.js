//const logfolder = require('../../Logs');
const fs = require('fs');

class Logger {

    constructor() {

        this.logbook;
        this.interval;
        this.index;

    }

    async init(index) {

        if(!index) throw new Error('Missing index!');

        this.index = index;
        index.logger = this;

        this.print('Starting logger.');
        if(!fs.existsSync('./Website-Logs')) {
            this.print('Log directory not found, creating new.')
            fs.mkdirSync('./Website-Logs');
        }
        this.logbook = fs.createWriteStream(`./Website-Logs/Website-${~~(Date.now()/1000)}.log`);
        this.logbook.write(`====== Website Logbook - ${new Date().toUTCString()} ======\n\n`);
        this.interval = setInterval(() => {this.logbook.write(`\n============ ${new Date().toUTCString()} ============\n`)}, 15*60*1000)
        this.print('Logger started.');
        return this;

    }

    log(text) {

        if(!this.logbook) return;
        let date = new Date();
        let offset = -date.getTimezoneOffset()/60;
        this.logbook.write(`[${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours() }:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()} (GMT${offset >= 0 ? '+' + offset : '-' + offset })] - ${text}\n`);

    }

    print(text) {

        this.log(`[INFO] ${text}`);
        console.log(`[INFO] ${text}`);

    }

    error(text) {

        this.log(`[ERROR] ${text}`);
        console.error(`⚠️ [ERROR] ${text}`);

    }

    warn(text) {

        this.log(`[WARNING] ${text}`);
        console.warn(`⚠️ [WARNING] ${text}`);

    }

    debug(text) {

        if(!this.index.debug) return;
        this.log(`[DEBUG] ${text}`); //[${this.debug.caller}]
        console.log(`[DEBUG] ${text}`)

    }

}

module.exports = new Logger();
