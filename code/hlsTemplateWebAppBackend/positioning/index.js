/*
 * Copyright (c) 2019 HERE Europe B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
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

// HERE Serverless Function for HERE Positioning API.

'use strict';

const config = require("../hereLibs/configurations");
const reqProcessor = require("../hereLibs/reqProcessor");
const eventProcessor = require("../hereLibs/eventProcessor");

const loggers = require("../hereLibs/logger");

// HERE credentials API Key
const HERE_API_KEY = process.env.HERE_API_KEY;

// Cosmos DB related parameters.
const HERE_COSMOSDB_ENDPOINT = process.env.HERE_COSMOSDB_ENDPOINT;
const HERE_COSMOSDB_KEY = process.env.HERE_COSMOSDB_KEY;

// Service Bus connectionstring. 
const HERE_SERVICEBUS_CONNECTIONSTRING = process.env.HERE_SERVICEBUS_CONNECTIONSTRING;

// DB ID and collection id.
const DATABASE_ID = config.cosmosDB.databaseId;
const CONTAINER_ID = config.cosmosDB.containerId_positioning;

var inputConfig = {
    "HERE_SERVICEBUS_CONNECTIONSTRING": HERE_SERVICEBUS_CONNECTIONSTRING,
    "HERE_API_KEY": HERE_API_KEY,
    "HERE_COSMOSDB_ENDPOINT": HERE_COSMOSDB_ENDPOINT,
    "HERE_COSMOSDB_KEY": HERE_COSMOSDB_KEY,
    "DATABASE_ID": DATABASE_ID,
    "CONTAINER_ID": CONTAINER_ID
}

module.exports = async function(context, serviceBusMsg) {

    // Input request object/serviceBusMsg should be in JSON format
    // Fields required are:
    /*
      req.api     // Available options : geocoder/positioning/fleet/routing/mapimage/maptile/
      req.uid     // Unique ID as sent by customer
      req.url     // URL without server Info : Refer HTTP trigger function for URLs
      req.method  // GET/POST 
      req.body    // Applicable when method is POST>
      req.contenttype  // Applicable for POST method when body is present. (JSON/XML/etc.)
    */

    //g et logger instance
    var logger = loggers.getLogger(context);

    // Start with an empty request object.
    var request = {};
    request._config = inputConfig

    // Scan Incoming Service bus msg and parse to validate it.
    if (!eventProcessor.validateIncomingMsg(request, serviceBusMsg)) {
        logger("[ERROR] :Incoming ServiceBusMessage Validation Failed");
        eventProcessor.createDBLog(logger, request);
        return;
    }

    //Build HERE_API_URL from mapping.
    if (!reqProcessor.buildHereApiUrl(request)) {
        logger("[ERROR ] :HERE_API_URL Mapping not found for given api.");
        eventProcessor.createDBLog(logger, request);
        return;
    }

    // Process Request Object and Prepare Proxy URL using HERE APP Credentials. 
    request._proxy = eventProcessor.processEvent(logger, request);

    // Invoke Proxy URL and fetch Response, GET/POST call is decided based on incoming method.
    request._result = await reqProcessor.getEventResult(logger, request);

    // Save the result in DB
    eventProcessor.createDBLog(logger, request)

    logger("[INFO] : Service Bus Message Processed successfully");

};

