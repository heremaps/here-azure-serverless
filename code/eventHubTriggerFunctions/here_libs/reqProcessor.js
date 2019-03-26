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

 
const httpClient        = require("../here_libs/httpClient.js");
const cosmos_db_worker  = require("../here_libs/dbOperations");
const cosmosdblogger    = require("../here_libs/cosmosDbLogger");
const config            = require("../here_libs/configurations");


//Process incoming Event Hub message and log incoming parameters.
function processEventHubRequest(log, req ) {

  //Log Environment Variable & Values.
  log(`[HERE_APP_ID]            : [${req._config.HERE_APP_ID}]`);
  log(`[HERE_APP_CODE]          : [${req._config.HERE_APP_CODE}]`);
  log(`[HERE_API_URL]           : [${req._config.HERE_API_URL}]`);
  log(`[HERE_COSMOSDB_ENDPOINT] : [${req._config.HERE_COSMOSDB_ENDPOINT}]`);
  log(`[HERE_COSMOSDB_KEY]      : [${req._config.HERE_COSMOSDB_KEY}]`);
  log(`[HERE_EVENTHUB_NS_CONNECTIONSTRING] : [${req._config.HERE_EVENTHUB_NS_CONNECTIONSTRING}]`);
  
  //Find if we got any request body, ( valid for POST calls).
  log(`[Request API]            : [${req.api}]`);
  log(`[Request URL]            : [${req.url}]`);
  log(`[Request Body]           : [${req.body}]`); 
  log(`[Request Method]         : [${req.method}]`);


  let proxy_url ="";
  //API URL ends with '/' char , hence ensure that req.url which appends to it doesnt have a leading '/' char
  req.url = req.url.charAt(0) === '/' ? req.url.substring(1) : req.url;

  if (req.url.indexOf("?") > 0 ) {
    proxy_url = `${req._config.HERE_API_URL}${req.url}&app_id=${req._config.HERE_APP_ID}&app_code=${req._config.HERE_APP_CODE}`
  }
  else {
    proxy_url = `${req._config.HERE_API_URL}${req.url}?app_id=${req._config.HERE_APP_ID}&app_code=${req._config.HERE_APP_CODE}`
  }

  let contentType = req.contenttype == undefined ? "*" : req.contenttype;
  let proxy = {
    "url" : proxy_url,
    "body" : req.body,
    "method" : req.method,
    "contenttype" : contentType
  }

  //Sanitize proxy URL, its requried for map-tile for now, more checks can come later.
  proxy.url = sanitizieUrl(proxy.url);
  return proxy;
}

//applicable for URLs where we have choice from 1-4 servers. this returns dynamically any value between 1-4.
function chooseRandomServer() {
  const max = 4;
  const min = 1;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//invoke proxy HERE API url and fetch its response.
async function getAPIResult(log, req) {
  log(`[Fetching Proxy Response]: [BEGIN]`);
  var result;
  
  if (req._proxy.method.toUpperCase() == "GET") {
    result = await httpClient.async_get(req._proxy.url);
  
  } else if (req._proxy.method.toUpperCase() == "POST") {
    result = await httpClient.async_post(req._proxy.url, req._proxy.body, req._proxy.contenttype);
  }
  
  log(`[Proxy Response Status  ]: [${result.status}]`);
  //Modify received response after intercepting it, if required.
  log(`[Fetching Proxy Response]: [END]`);
  return result;

}
function createDBLog(log,req) {
  
  //Prepare JSON formatted log for storing in Cosmos DB. 
  var logEntry  = cosmosdblogger.prepareEventHubLog(req);
  log("[INFO] : EventHub Msg Log for COSMOS DB prepared successfully. ");

  //Create CosmosDB Client instance to invoke storage.
  var cosmos_db = new cosmos_db_worker(
    req._config.HERE_COSMOSDB_ENDPOINT,
    req._config.HERE_COSMOSDB_KEY,
    req._config.DATABASE_ID,
    req._config.CONTAINER_ID);

  cosmos_db.createDB()
  .then(function(result){
        //Store prepared log entry in Cosmos DB.
      cosmos_db.createLogEntry(logEntry)
      .then(function(result){
        log("[INFO] : CosmosDB Write OK: " + result);
      })
  .catch(function(err){
    log("[ERROR] : CosmosDB Write Err : " + err)
  });

  })
  .catch(function(err){
    log(err);
  });

}
//validate incoming event-hub message for its JSON wellformedness.
function validateIncomingMsg(req,eventHubMsg) {
  try {
    //parse incoming message and merge with existing req object.
    req = Object.assign(req,JSON.parse(JSON.stringify(eventHubMsg)));
    return true;
  }
  catch(err){
    req._error = "JSON parsing for incoming eventHub msg failed,[" +  err  + "]";
    return false;
  }
}

//Dynamically build HERE API URL to be used by various apis.
function buildHereApiUrl(req){
  
  var url = ""

  switch(req.api) {
    case "places" :
      url = getPlacesApiUrl() ;
      break;
    case "routing" :
      url = getRoutingApiUrl(req);
      break;
    case "positioning" :
      url = getPositioningApiUrl() ;
      break; 
    case "map_tile/aerial" :
    case "map_tile/base" :
    case "map_tile/pano" :
    case "map_tile/traffic" :
      url = getMapTileApiUrl(req);
      break;
    case "fleet" :
      url = getFleetTelematicsUrl();
      break;
    case "map_image" :
      url = getMapImageUrl();
      break;
    case "geocoder" :
      url = getGeocoderUrl(req);
      break;
    
    default :
      var errorMsg = "HERE_API_URL mapping not found , incoming message [req.api] = [" + req.api + "]";
      req._error = errorMsg;
      return false;  //Default return false.
  }    
  req._config.HERE_API_URL = url ;
  return true;
}

function getRoutingApiUrl(req){
  var url = ""
  if (req.url.indexOf("calculateisoline") > 0 )    {  url =  config.urls.HERE_ROUTING_ISOLINE_URL;       }
  else if (req.url.indexOf("calculatematrix") > 0 ){  url =  config.urls.HERE_ROUTING_MATRIX_URL;        }
  else                                             {  url =  config.urls.HERE_ROUTING_URL;               }
  return url;
}
function getPlacesApiUrl(){
  return config.urls.HERE_PLACES_URL;
}
function getPositioningApiUrl(){
  return config.urls.HERE_POS_URL ;
}
function getMapTileApiUrl(req){

  let randomServer = chooseRandomServer();
  if (req.api == "map_tile/aerial" ){
    return config.urls.HERE_MAPTILE_AERIAL_URL.replace("1TO4",randomServer.toString())
  }
  else if (req.api == "map_tile/base" ){
    return config.urls.HERE_MAPTILE_BASE_URL.replace("1TO4",randomServer.toString());
  }
  else if (req.api == "map_tile/pano" ){
    return config.urls.HERE_MAPTILE_PANO_URL.replace("1TO4",randomServer.toString());
  }
  else if (req.api == "map_tile/traffic" ){
    return config.urls.HERE_MAPTILE_TRAFFIC_URL.replace("1TO4",randomServer.toString());
  }
  return "NOTFOUND" //Default to ""(empty str) .
}
function getFleetTelematicsUrl(){
  return config.urls.HERE_FLEET_TELEMATICS_URL;
}
function getMapImageUrl(){
  return config.urls.HERE_MAP_IMAGE_URL
}
function getGeocoderUrl(req){
  if (req.url.indexOf("reversegeocode") >= 0 ){
    return config.urls.HERE_REVERSE_GEOCODER_URL;
  }
  else  {
    return config.urls.HERE_GEOCODER_URL;
  }
}
function sanitizieUrl(url) {

  //this function removes extra param passed for base URL identification.
  if (url.indexOf("maps.api.here.com/aerial/") > 0 ) {
    return url.replace("maps.api.here.com/aerial/", "maps.api.here.com/")
  } else if (url.indexOf("maps.api.here.com/base/") > 0) {
    return url.replace("maps.api.here.com/base/", "maps.api.here.com/")
  } else if (url.indexOf("maps.api.here.com/pano/") > 0) {
    return url.replace("maps.api.here.com/pano/", "maps.api.here.com/")
  } else if (url.indexOf("maps.api.here.com/traffic/") > 0) {
    return url.replace("maps.api.here.com/traffic/", "maps.api.here.com/")
  } else if (url.indexOf("maps.api.here.com//aerial/") > 0 ) {
    return url.replace("maps.api.here.com//aerial/", "maps.api.here.com/")
  } else if (url.indexOf("maps.api.here.com//base/") > 0) {
    return url.replace("maps.api.here.com//base/", "maps.api.here.com/")
  } else if (url.indexOf("maps.api.here.com//pano/") > 0) {
    return url.replace("maps.api.here.com//pano/", "maps.api.here.com/")
  } else if (url.indexOf("maps.api.here.com//traffic/") > 0) {
    return url.replace("maps.api.here.com//traffic/", "maps.api.here.com/")
  }
  //Default "Unchanged URL returned"
  return url;
}
module.exports = {
  processEventHubRequest: processEventHubRequest,
  getAPIResult: getAPIResult,
  chooseRandomServer: chooseRandomServer,
  createDBLog : createDBLog,
  buildHereApiUrl : buildHereApiUrl,
  validateIncomingMsg :validateIncomingMsg,

}

/*EOF */
