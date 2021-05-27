const MongoClient = require('mongodb').MongoClient;

/**
 * A dedicated class to wrap mongodb
 *
 * @class Database
 */
class Database {

    constructor(manager, config) {

        if(!manager) throw new Error('Missing reference to manager!')
        if(!config) throw new Error('No config file provided!');
        if(config && (!config.database || !config.url)) throw new Error('Invalid config file provided!');

        this.config = config;
        this.client;
        this.db;
        this.manager = manager;
        this.logger = manager.logger

    }

    async init() {

        this.manager.logger.print('Initializing database connection.')

        try {

            this.client = await MongoClient.connect(this.config.url+this.config.database, { useUnifiedTopology: true });
            this.db = await this.client.db(this.config.database);
            this.logger.print('Database connected.');

        } catch(err) {

            this.logger.error('Database connection failed!\n' + err);

        }

        return this;

    }

    /**
     * Find and return the first match
     *
     * @param {String} db The collection in which the data is to be updated
     * @param {Object} query The filter that is used to find the data
     * @returns {Array} An array containing the corresponding objects for the query
     * @memberof Database
     */
    find(db, query) {

        if(this.manager.debug) this.logger.debug(`Incoming find query for ${db} with parameters ${JSON.stringify(query)}`);
        return new Promise((resolve, reject) => {

            this.db.collection(db).find(query, async (error, cursor) => {

                if(error) return reject(error);
                return resolve(await cursor.toArray());

            });

        });

    }

    /**
     * Find and return the first match
     *
     * @param {String} db The collection in which the data is to be updated
     * @param {Object} query The filter that is used to find the data
     * @returns {Object} An object containing the queried data
     * @memberof Database
     */
    findOne(db, query) {

        if(this.manager.debug) this.logger.debug(`Incoming findOne query for ${db} with parameters ${JSON.stringify(query)}`);
        return new Promise((resolve, reject) => {

            this.db.collection(db).findOne(query, async (error, item) => {

                if(error) return reject(error);
                return resolve(item);
                
            });

        });

    }

    /**
     * Update any and all filter matches.
     * DEPRECATED!
     *
     * @param {String} db The collection in which the data is to be updated
     * @param {Object} filter The filter that is used to find the data
     * @param {Object} data The updated data
     * @returns {WriteResult} Object containing the followint counts: Matched, Upserted, Modified
     * @memberof Database
     */
    update(db, filter, data) {

        if(this.manager.debug) this.logger.debug(`Incoming update query for '${db}' with parameters\n${JSON.stringify(query)}\nand data\n${JSON.stringify(data)}`);
        this.logger.warn('Database.update() is deprecated!');
        return new Promise((resolve, reject) => {

            this.db.collection(db).update(filter, data, async (error, result) => {
                if(error) return reject(error);
                else return resolve(result);
            });

        });

    }

    /**
     * Update the first filter match.
     *
     * @param {String} db The collection in which the data is to be updated
     * @param {Object} filter The filter that is used to find the data
     * @param {Object} data The updated data
     * @returns {WriteResult} Object containing the followint counts: Matched, Upserted, Modified
     * @memberof Database
     */
    updateOne(db, filter, data, upsert = false) {

        if(this.manager.debug) this.logger.debug(`Incoming updateOne query for ${db} with parameters ${JSON.stringify(query)}`);
        return new Promise((resolve, reject) => {
            
            this.db.collection(db).updateOne(filter, { $set: data }, { upsert: upsert }, async (error, result) => {
                
                if(error) return reject(error);
                else {
                    //return resolve(result)
                    let { matchedCount, upsertedCount, modifiedCount } = result;
                    return resolve({ matched: matchedCount, upserted: upsertedCount, modified: modifiedCount });
                }
            });

        });

    }

    /**
     * Push data to an array
     *
     * @param {string} db The collection to query
     * @param {object} filter The filter to find the document to update
     * @param {object} data The data to be pushed
     * @param {boolean} [upsert=false]
     * @returns
     * @memberof Database
     */
    push(db, filter, data, upsert = false) {

        if(this.manager.debug) this.logger.debug(`Incoming push query for ${db}, with upsert ${upsert} and with parameters ${JSON.stringify(filter)} and data ${JSON.stringify(data)}`);
        return new Promise((resolve, reject) => {

            this.db.collection(db).updateOne(filter, { $push: data }, { upsert: upsert }, async (error, result) => {

                if(error) return reject(error);
                else return resolve(result);

            });

        });

    }

    /**
     * Find a random element from a database
     *
     * @param {string} db The collection to query
     * @param {object} [filter={}] The filtering object to narrow down the sample pool
     * @param {number} [amount=1] Amount of items to return
     * @returns {object}
     * @memberof Database
     */
    random(db, filter = {}, amount = 1) {

        if(this.manager.debug) this.logger.debug(`Incoming random query for ${db} with parameters ${JSON.stringify(query)} and amount ${amount}`);
        if(amount>100) amount = 100;

        return new Promise((resolve, reject)=>{

            this.db.collection(db).aggregate([{ $match: filter }, { $sample: {size: amount}}], function(err, item) {

                if(err) return reject(err);
                resolve(item);

            });

        });

    } 

}

module.exports = Database;