const Registry = require('./Registry.js');

const Express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const http = require('http');
const https = require('https');

class Client {

    constructor(index, options = {}) {

        if(!index) throw new Error('Missing index!');
        this.index = index;
        this.options = options;
        this.logger = index.logger;
        this.database = index.database;

        this.registry = new Registry(this);

        this.app = Express();
        //this.app.listen(3000, (err) => { if(err) this.logger.warn(err); else this.logger.print(`Listening on port 3000`) });
        this.server = https.createServer(this.options, this.app).listen(3000);

        //Set up rendering engine
        this.app.engine('.hbs', exphbs({
            defaultLayout: 'main',
            extname: '.hbs',
            layoutsDir: path.join(__dirname, 'views/layouts')
        }));
        this.app.set('view engine', '.hbs');
        this.app.set('views', path.join(__dirname, 'views'));
        
        //Registry has to be finalized after express has been set up
        this.registry.init().then(() => this.logger.print('Registry done'));

    }

}

module.exports = Client;