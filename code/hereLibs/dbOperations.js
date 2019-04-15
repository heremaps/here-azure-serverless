/*
 * Copyright (c) 2019 HERE Europe B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * License-Filename: LICENSE
 */

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
            await this.client.databases.createIfNotExists({ id: this.databaseId });
            result += "\nCreate (ifNotExist) DB        :[" + this.databaseId + "]\n";

            await this.client.database(this.databaseId).containers.createIfNotExists({ id: this.containerId });
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
            return("Cosmos DB log entry created with id :", item.id);
        }
        catch (error) {
            throw("CosmosClient.createLogEntry throwing exception:" + error );
        }
    }

}
module.exports = cosmos_db_worker_class;
