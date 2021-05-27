const Registry = require('./Registry.js');

const Express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const http = require('http');
const https = require('https');

class Client {

    constructor(manager, options = {  }) {

        if (!manager) throw new Error('Missing manager!');
        this.manager = manager;
        this.options = options;
        this.logger = manager.logger;
        this.database = manager.database;

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

        this.app.use(Express.urlencoded({ extended: true }));
        this.app.use(Express.json());

        //Set up rendering engine
        // this.app.engine('.hbs', exphbs({
        //     defaultLayout: 'main',
        //     extname: '.hbs',
        //     layoutsDir: path.join(this.manager.dir, 'Views/Layouts')
        // }));
        // this.app.set('view engine', '.hbs');
        // this.app.set('views', path.join(this.manager.dir, 'Views/Pages'));
        // this.app.use(Express.static(path.join(this.manager.dir, '/Public')));
        
        //Registry has to be finalized after express has been set up
        this.registry.init().then(() => this.logger.print('Registry done'));
        //console.log(this.registry.print);

    }

}

module.exports = Client;