module.exports = {
    debug: true,
    started: ~~(Date.now()/1000)
}

require('./Utilities/Startup.js').init(module.exports);