const Endpoint = require('../Structures/Endpoint.js');

class CorgiEndpoint extends Endpoint {

    constructor(client) {

        super({
            client: client,
            path: '/corgi',
            name: 'corgi'
        })

        this.methods = [
            ['get', this.fetchImage ]
        ]

        this.init();

    }

    //Actual endpoint implementation
    async fetchImage(req, res) {

        console.log('lol');

    }

}

module.exports = CorgiEndpoint;