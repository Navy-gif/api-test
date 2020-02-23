const Endpoint = require('../../Structures/Endpoint.js');

class Home extends Endpoint {

    constructor(client) {

        super({
            client: client,
            path: '/',
            name: 'home'
        })

        this.methods = [
            [ 'get', this.get.bind(this) ]
        ]

        this.init();

    }

    //Actual endpoint implementation
    async get(req, res) {

        res.render('home');

    }

}

module.exports = Home;