const mongoConfig = require('./mongo.config')

async function listDatabases() {
    const client = await mongoConfig.connectToDB();

    databasesList = await client.db().admin().listDatabases();

    client.db().collection('events').insertOne({a: "ye"})

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

listDatabases()