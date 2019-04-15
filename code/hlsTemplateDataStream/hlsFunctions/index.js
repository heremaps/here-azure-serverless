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

 /*
 * HERE Serverless Function generic Handler.
 * Caters to below 7 API from Here Location suite.
 * 1. Geocoder 
 * 2. Positioning
 * 3. Routing
 * 4. Places
 * 5. Fleet Telematics
 * 6. Map Images
 * 7. Map Tiles
 */


'use strict';

const config            = require("../hereLibs/configurations");
const reqProcessor      = require("../hereLibs/reqProcessor");
const eventProcessor      = require("../hereLibs/eventProcessor");

const loggers           = require("../hereLibs/logger");

//HERE credentials App_Code and App_Id
const HERE_APP_CODE = process.env.HERE_APP_CODE;
const HERE_APP_ID   = process.env.HERE_APP_ID;

//Cosmos DB related parameters.
const HERE_COSMOSDB_ENDPOINT = process.env.HERE_COSMOSDB_ENDPOINT;
const HERE_COSMOSDB_KEY      = process.env.HERE_COSMOSDB_KEY;

//EventHub Bus connectionstring. 
const HERE_EVENTHUB_NS_CONNECTIONSTRING = process.env.HERE_EVENTHUB_NS_CONNECTIONSTRING;
 
//DB ID and collection id.
const DATABASE_ID   = config.cosmosDB.databaseId; 
const CONTAINER_ID  = config.cosmosDB.containerId;

var inputConfig = {
  "HERE_EVENTHUB_NS_CONNECTIONSTRING" :HERE_EVENTHUB_NS_CONNECTIONSTRING,
  "HERE_APP_CODE" : HERE_APP_CODE,
  "HERE_APP_ID" : HERE_APP_ID,
  "HERE_COSMOSDB_ENDPOINT" : HERE_COSMOSDB_ENDPOINT,
  "HERE_COSMOSDB_KEY" : HERE_COSMOSDB_KEY,
  "DATABASE_ID" : DATABASE_ID,
  "CONTAINER_ID" : CONTAINER_ID
}

module.exports = async function(context, eventHubMsg) {

  //input reuest object/eventHubMsg should be in JSON format  
  //Fields required are as :
  /*
    req.api     //available options : geocoder/places/positioning/fleet/routing/mapimage/maptile/
    req.uid     //Unique ID as sent by customer
    req.url     //URL without server Info : Refer HTTP trigger function for URLs
    req.method  //GET/POST 
    req.body    //Applicable when method is POST>
    req.contenttype  //applicable for POST method when body is present. ( JSON/XML/etc..)
    
  */

  //get logger instance
  var logger = loggers.getLogger(context);

  //Print eventHubMsg for debug purpose.
  logger("eventHubMsg stringify: [" + JSON.stringify(eventHubMsg) + "]") ;

  //Start with an empty request object.
  var request = {};
  request._config = inputConfig

  //Scan Incoming event bus msg and parse to validate it.
  if (! eventProcessor.validateIncomingMsg(request, eventHubMsg)){
    logger("[ERROR] :Incoming eventHub Validation Failed");
    eventProcessor.createDBLog(logger,request);
    return; 
  }
  
  logger("Incoming request : ", JSON.stringify(request,null,4));
  //Build HERE_API_URL from mapping.
  if (! reqProcessor.buildHereApiUrl(request)) {
    logger("[ERROR ] :HERE_API_URL Mapping not found for given api.");
    eventProcessor.createDBLog(logger,request);
    return;
  }
 
  //Process Request Object and Prepare Proxy URL using HERE APP Credentials. 
  request._proxy  = eventProcessor.processEvent(logger, request );

  //Invoke Proxy URL and fetch Response, GET/POST call is decided based on incoming method.
  request._result = await reqProcessor.getEventResult(logger,request);

  //save the result in DB
  eventProcessor.createDBLog(logger,request)

  logger("[INFO] : EventHub Bus Message Processed successfully");
  
 }; 

 /* EOF */

 
