class Endpoint {

    constructor({ client, path, name }) {
        
        this.client = client;
        this.path = path;
        this.name = name;

    }

    init() {

        for(let [method, cb] of this.methods) {

            this.client.app[method](this.path, async (...args) => {
                return await cb(...args);
            });

        }

    }

}

module.exports = Endpoint;