const Endpoint = require('./Endpoint.js');

class ApiEndpoint extends Endpoint {

    constructor({ client, path, name }) {

        super({
            client: client,
            path: '/api' + path,
            name: name
        });

    }

}

module.exports = ApiEndpoint;