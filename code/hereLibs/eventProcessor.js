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

const cosmos_db_worker = require("../hereLibs/dbOperations");
const cosmosdblogger = require("../hereLibs/cosmosDbLogger");

// Process incoming event message and log incoming parameters.
function processEvent(log, req) {
    // var eventType=""
    // Log Environment Variable & Values.
    log(`[HERE_APP_KEY]          : [${req._config.HERE_APP_KEY}]`);

    log(`[HERE_API_URL]           : [${req._config.HERE_API_URL}]`);
    log(`[HERE_COSMOSDB_ENDPOINT] : [${req._config.HERE_COSMOSDB_ENDPOINT}]`);
    log(`[HERE_COSMOSDB_KEY]      : [${req._config.HERE_COSMOSDB_KEY}]`);
    if (req._config.HERE_SERVICEBUS_CONNECTIONSTRING) {
        // eventType="serviceBusMsg";
        log(`[HERE_SERVICEBUS_CONNECTIONSTRING] : [${req._config.HERE_SERVICEBUS_CONNECTIONSTRING}]`);
    } else if (req._config.HERE_EVENTHUB_NS_CONNECTIONSTRING) {
        // eventType="eventHubMsg";
        log(`[HERE_EVENTHUB_NS_CONNECTIONSTRING] : [${req._config.HERE_EVENTHUB_NS_CONNECTIONSTRING}]`);
    }

    // Find if we got any request body, ( valid for POST calls).
    log(`[Request API]            : [${req.api}]`);
    log(`[Request URL]            : [${req.url}]`);
    log(`[Request Body]           : [${req.body}]`);
    log(`[Request Method]         : [${req.method}]`);


    let proxy_url = "";
    // API URL ends with '/' char , hence ensure that req.url which appends to it doesnt have a leading '/' char
    req.url = req.url.charAt(0) === '/' ? req.url.substring(1) : req.url;

    
    if (req.url.indexOf("?") > 0) {
        proxy_url = `${req._config.HERE_API_URL}${req.url}&apikey=${req._config.HERE_API_KEY}`
    } else {
        proxy_url = `${req._config.HERE_API_URL}${req.url}?apikey=${req._config.HERE_API_KEY}`
    }

    

    let contentType = req.contenttype == undefined ? "*" : req.contenttype;
    let proxy = {
        "url": proxy_url,
        "body": req.body,
        "method": req.method,
        "contenttype": contentType
    }

    // Sanitize proxy URL, its requried for map-tile for now, more checks can come later.
    proxy.url = sanitizieUrl(proxy.url);
    return proxy;
}

function createDBLog(log, req) {
    // Prepare JSON formatted log for storing in Cosmos DB. 
    var logEntry = cosmosdblogger.prepareEventMsg(req);
    log("[INFO] : LogMsg for COSMOS DB prepared successfully. ");
    //  log("logEntry : " + JSON.stringify(logEntry,null,2));

    // Create CosmosDB Client instance to invoke storage.
    var cosmos_db = new cosmos_db_worker(
        req._config.HERE_COSMOSDB_ENDPOINT,
        req._config.HERE_COSMOSDB_KEY,
        req._config.DATABASE_ID,
        req._config.CONTAINER_ID);

    cosmos_db.createDB()
        .then(function(dbResult) {
            log("[INFO] : Create DB Logs : " + JSON.stringify(dbResult));
            // Store prepared log entry in Cosmos DB.
            cosmos_db.createLogEntry(logEntry)
                .then(function(result) {
                    log("[INFO] : CosmosDB Write OK: " + result);
                })
                .catch(function(err) {
                    log("[ERROR] : CosmosDB Write Err : " + err)
                });

        })
        .catch(function(err) {
            log(err);
        });

}
// validate incoming eventMsg message for its JSON wellformedness.
function validateIncomingMsg(req, eventMsg) {
    try {
        // parse incoming message and merge with existing req object.
        req = Object.assign(req, JSON.parse(JSON.stringify(eventMsg)));
        return true;
    } catch (err) {
        req._error = "JSON parsing for incoming event failed,[" + err + "]";
        return false;
    }
}

function sanitizieUrl(url) {
    // this function removes extra param passed for base URL identification.
    if (url.indexOf("maps.api.here.com/aerial/") > 0) {
        return url.replace("maps.api.here.com/aerial/", "maps.api.here.com/")
    } else if (url.indexOf("maps.api.here.com/base/") > 0) {
        return url.replace("maps.api.here.com/base/", "maps.api.here.com/")
    } else if (url.indexOf("maps.api.here.com/pano/") > 0) {
        return url.replace("maps.api.here.com/pano/", "maps.api.here.com/")
    } else if (url.indexOf("maps.api.here.com/traffic/") > 0) {
        return url.replace("maps.api.here.com/traffic/", "maps.api.here.com/")
    } else if (url.indexOf("maps.api.here.com//aerial/") > 0) {
        return url.replace("maps.api.here.com//aerial/", "maps.api.here.com/")
    } else if (url.indexOf("maps.api.here.com//base/") > 0) {
        return url.replace("maps.api.here.com//base/", "maps.api.here.com/")
    } else if (url.indexOf("maps.api.here.com//pano/") > 0) {
        return url.replace("maps.api.here.com//pano/", "maps.api.here.com/")
    } else if (url.indexOf("maps.api.here.com//traffic/") > 0) {
        return url.replace("maps.api.here.com//traffic/", "maps.api.here.com/")
    }
    // URL supported for ApiKey 
    else if (url.indexOf("maps.ls.hereapi.com/aerial/") > 0) {
        return url.replace("maps.ls.hereapi.com/aerial/", "maps.ls.hereapi.com/")
    } else if (url.indexOf("maps.ls.hereapi.com/base/") > 0) {
        return url.replace("maps.ls.hereapi.com/base/", "maps.ls.hereapi.com/")
    } else if (url.indexOf("maps.ls.hereapi.com/pano/") > 0) {
        return url.replace("maps.ls.hereapi.com/pano/", "maps.ls.hereapi.com/")
    } else if (url.indexOf("maps.ls.hereapi.com/traffic/") > 0) {
        return url.replace("maps.ls.hereapi.com/traffic/", "maps.ls.hereapi.com/")
    } else if (url.indexOf("maps.ls.hereapi.com//aerial/") > 0) {
        return url.replace("maps.ls.hereapi.com//aerial/", "maps.ls.hereapi.com/")
    } else if (url.indexOf("maps.ls.hereapi.com//base/") > 0) {
        return url.replace("maps.ls.hereapi.com//base/", "maps.ls.hereapi.com/")
    } else if (url.indexOf("maps.ls.hereapi.com//pano/") > 0) {
        return url.replace("maps.ls.hereapi.com//pano/", "maps.ls.hereapi.com/")
    } else if (url.indexOf("maps.ls.hereapi.com//traffic/") > 0) {
        return url.replace("maps.ls.hereapi.com//traffic/", "maps.ls.hereapi.com/")
    }
    // Default "Unchanged URL returned"
    return url;
}

module.exports = {
    validateIncomingMsg: validateIncomingMsg,
    processEvent: processEvent,
    createDBLog: createDBLog
}
