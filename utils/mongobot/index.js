const Mongo = require('mongodb');

const MONGO_OPTIONS = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}

class MongoBot {
    constructor() {
        this.MongoDB = Mongo;
        const url = process.env.MONGO_CONNECTION_STRING;
        this.client = new Mongo.MongoClient(url, MONGO_OPTIONS);
    }
    async init() {
        await this.client.connect();
        this.db = this.client.db(process.env.MONGO_DATABASE);
    }
}

module.exports = new MongoBot();