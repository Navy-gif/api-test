const fs = require('fs');
const path = require('path');

class Startup {

    static async init(index) {

        if(!index) throw new Error('Missing index!');

        //Set up logger
        console.log('Starting up...');
        index.logger = await require('./Logger.js').init(index);

        index.logger.print('Log test.');
        index.logger.debug('Debug test');
        index.logger.error('Error test.');
        index.logger.warn('Warning test.');

        process.on('uncaughtException', e => {
            index.logger.error('Uncaught exception:');
            index.logger.error(e.stack);
        });
        process.on('unhandledRejection', e => {
            index.logger.error('Unhandled rejection:');
            index.logger.error(e.stack);
        });
        process.on('warning', e => {
            index.logger.warn('Warning:');
            index.logger.warn(e.stack);
        });

        //Set up database connection
        let Database = require('./Database.js');
        index.database = await new Database(index, require('../Config/Mongodb.json')).init();

        //Initiate client
        let key, cert, Client = require('../Structures/Client.js');

        try {
            key = fs.readFileSync(path.join(index.dir, 'host.key.pem'));
            cert = fs.readFileSync(path.join(index.dir, 'host.crt.pem'));
        } catch(err) {
            index.logger.error('Could not find key or certificate!');
            index.logger.error(err.stack);
        }

        index.client = new Client(index, {
            key: key,
            cert: cert
        });

    }

}

module.exports = Startup;