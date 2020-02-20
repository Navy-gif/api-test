const fs = require('fs');
const path = require('path')

class Registry {

    constructor(client) {

        this.endpoints = new Map();
        this.client = client;

    }

    async init() {

        let dir_path = path.join(this.client.index.dir, 'Endpoints');
        let endpoints_dir = fs.readdirSync(dir_path);
        console.log('Endpoints: ' + endpoints_dir)
        
        for(let file of endpoints_dir) {

            file = path.join(dir_path, file);
            console.log('Final path ' + path)
            let endpoint = require(file);
            if(!endpoint) this.client.logger.warn(`Issue requiring \`${file}\``);

            endpoint = new endpoint(this.client);
            this.endpoints.set(endpoint.name, endpoint);

        }

    }

}

module.exports = Registry;