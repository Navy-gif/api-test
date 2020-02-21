const Endpoint = require('../Structures/Endpoint.js');

class CorgiEndpoint extends Endpoint {

    constructor(client) {

        super({
            client: client,
            path: '/corgi',
            name: 'corgi'
        })

        this.methods = [
            [ 'get', this.fetchImage.bind(this) ]
        ]

        this.init();

    }

    //Actual endpoint implementation
    async fetchImage(req, res) {

        res.send({ status: 'ok', code: 200, path: this.path });

    }

}

module.exports = CorgiEndpoint;