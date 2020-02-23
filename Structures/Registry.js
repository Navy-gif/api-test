const fs = require('fs');
const path = require('path')

class Registry {

    constructor(client) {

        this.endpoints = new Map();
        this.client = client;

    }

    get print() {

        let out = [];
        this.endpoints.forEach(ep => out.push(ep.name));
        return 'Registry print: ' + out.join(', ');

    }

    async init() {

        let dir_path = path.join(this.client.index.dir, 'Endpoints');
        let self = this;

        (function read(pth) {

            let endpoints_dir = fs.readdirSync(pth, { withFileTypes: true });

            for(let file of endpoints_dir) {

                if(file.name === 'Invalid.js'/* || file.name === 'Website'*/) continue;

                if(file.isDirectory()) read(path.join(pth, file.name));
                else {
                    self.client.logger.print(`Loading endpoint ${file.name}`);
                    file = path.join(pth, file.name);
                    let endpoint = require(file);
                    if(!endpoint) self.client.logger.warn(`Issue requiring \`${file}\``);
        
                    endpoint = new endpoint(self.client);
                    self.endpoints.set(endpoint.name, endpoint);
                }
    
            }

        })(dir_path);

    }

}

module.exports = Registry;