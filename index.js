module.exports = {
    debug: true,
    started: ~~(Date.now()/1000),
    dir: process.cwd()
}

require('./Utilities/Startup.js').init(module.exports);