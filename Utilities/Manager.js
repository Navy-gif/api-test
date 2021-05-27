const fs = require('fs');
const path = require('path');

class Manager {

    constructor(options) {
        this.options = options;
    }

    async init() {

        //Set up logger
        console.log('Starting up...');
        this.logger = await require('./Logger.js').init(this);

        this.logger.print('Log test.');
        this.logger.debug('Debug test');
        this.logger.error('Error test.');
        this.logger.warn('Warning test.');

        process.on('uncaughtException', e => {
            this.logger.error('Uncaught exception:');
            this.logger.error(e.stack);
        });
        process.on('unhandledRejection', e => {
            this.logger.error('Unhandled rejection:');
            this.logger.error(e.stack);
        });
        process.on('warning', e => {
            this.logger.warn('Warning:');
            this.logger.warn(e.stack);
        });

        this.dir = process.cwd();

        //Set up database connection
        //let Database = require('./Database.js');
        //this.database = await new Database(this, require('../Config/Mongodb.json')).init();

        //Initiate client
        let key, cert, Client = require('../Structures/Client.js');

        try {
            key = fs.readFileSync(path.join(this.dir, 'host.key.pem'));
            cert = fs.readFileSync(path.join(this.dir, 'host.crt.pem'));
        } catch(err) {
            this.logger.error('Could not find key or certificate!');
            this.logger.error(err.stack);
        }

        this.client = new Client(this, {
            key: key,
            cert: cert
        });

    }

}

module.exports = Manager;