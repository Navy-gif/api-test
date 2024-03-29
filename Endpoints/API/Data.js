const ApiEndpoint = require('../../Structures/ApiEndpoint.js');

class Data extends ApiEndpoint {

    constructor(client) {

        super({
            client: client,
            path: '/data/:id',
            name: 'data'
        })

        this.methods = [
            [ 'get', this.get.bind(this) ],
            [ 'post', this.post.bind(this) ]
        ]

        this.init();

    }

    //Actual endpoint implementation
    async get(req, res) {

        res.send({ status: 'OK', message: 'This endpoint should return data to you!', code: 200, path: req.path, params: req.params });
        console.log('lol get')

    }

    async post(req, res) {

        res.send({ status: 'OK', message: 'This endpoint should post data for you!', code: 200, path: req.path });
        console.log(req.body);
        console.log(req.body.data.round)

    }

}

module.exports = Data;