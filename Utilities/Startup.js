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

        process.on('uncaughtException', e => index.logger.error(e));
        process.on('unhandledRejection', e => index.logger.error(e));
        process.on('warning', e => index.logger.warn(e));

        //Set up database connection
        let Database = require('./Database.js');
        index.database = await new Database(index, require('../Config/Mongodb.json')).init();

        //Initiate client
        let Client = require('../Structures/Client.js');
        index.client = new Client(index, {
            key: fs.readFileSync(path.join(index.dir, 'host.key.pem')),
            cert: fs.readFileSync(path.join(index.dir, 'host.crt.pem'))
        });

    }

}

module.exports = Startup;