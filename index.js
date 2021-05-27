const Manager = require('./Utilities/Manager.js')
const options = require('./Config/options.json')

const manager = new Manager(options);
manager.init();