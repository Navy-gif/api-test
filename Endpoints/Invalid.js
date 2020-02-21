const Endpoint = require('../Structures/Endpoint.js');

class InvalidEndpoint extends Endpoint {

    constructor(client) {

        super({
            client: client,
            path: '*',
            name: '404'
        })

        this.methods = [
            [ 'get', this.call.bind(this) ]
        ]

        this.init();

    }

    //Actual endpoint implementation
    async call(req, res) {

        res.send({ status: 'not ok', code: 404, path: req.path });

    }

}

module.exports = InvalidEndpoint;