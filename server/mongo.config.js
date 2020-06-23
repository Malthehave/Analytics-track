const { MongoClient } = require('mongodb');
require('dotenv').config()

const uri = process.env.MONGODB_URL;

async function connectToDB() {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        // Connect to the MongoDB cluster
        await client.connect();
    } catch (err) {
        console.error(err);
    }
    return client;
}

// const cleanup = async (client) => {
//     await client.close();
// }

module.exports.connectToDB = connectToDB;