const Registry = require('./Registry.js');

const Express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const http = require('http');
const https = require('https');

class Client {

    constructor(index, options = {  }) {

        if(!index) throw new Error('Missing index!');
        this.index = index;
        this.options = options;
        this.logger = index.logger;
        this.database = index.database;

        this.registry = new Registry(this);

        this.app = Express();
        
        if(!this.options.port) this.options.port = 3000;

        if(options.key && options.cert) {
            this.logger.print(`Starting https server on port ${this.options.port}`)
            this.server = https.createServer(this.options, this.app).listen(this.options.port);
        } else {
            this.logger.print(`Missing cert or key file, starting insecure server on port ${this.options.port}`)
            this.server = http.createServer(this.app).listen(this.options.port);
        }

        //Set up rendering engine
        this.app.engine('.hbs', exphbs({
            defaultLayout: 'main',
            extname: '.hbs',
            layoutsDir: path.join(this.index.dir, 'Views/Layouts')
        }));
        this.app.set('view engine', '.hbs');
        this.app.set('views', path.join(this.index.dir, 'Views/Pages'));
        this.app.use(Express.static(path.join(this.index.dir, '/Public')));
        
        //Registry has to be finalized after express has been set up
        this.registry.init().then(() => this.logger.print('Registry done'));
        //console.log(this.registry.print);

    }

}

module.exports = Client;