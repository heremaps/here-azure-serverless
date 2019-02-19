const CosmosClient = require('@azure/cosmos').CosmosClient;

class cosmos_db_worker_class {
    constructor(endpoint, masterKey, databaseId, containerId) {
        this.endpoint = endpoint;
        this.masterKey = masterKey;
        this.databaseId = databaseId;
        this.containerId = containerId;
        this.client = new CosmosClient({ endpoint, auth: { masterKey } });
    }

    async createDB() {
        try {
            var result = "DB Creation Logs:"
            const { database } = await this.client.databases.createIfNotExists({ id: this.databaseId });
            result += "\nCreate (ifNotExist) DB        :[" + this.databaseId + "]\n";

            const { container } = await this.client.database(this.databaseId).containers.createIfNotExists({ id: this.containerId });
            result += "Create (ifNotExist) Container :[" + this.containerId + "]\n";
        }
        catch (error) {
            throw ("CosmosClient.CreateDB throwing exception :[" + error + "]\n");
        }
        return (result);
    }
    async  createLogEntry(logEntry) {
        try {
            const { item } = await this.client.database(this.databaseId).container(this.containerId).items.create(logEntry);
            return("Cosmos DB log entry created");
        }
        catch (error) {
            throw("CosmosClient.createLogEntry throwing exception:" + error );
        }
    }

}
module.exports = cosmos_db_worker_class;