/*
 * Places API for HERE location suite
 * Date : 6-Feb-2019
 * Author : Navin Mistry
 * This Function handles all resources available under places API
 * 1.   actions
 * 2.   autosuggest
 * 3.   browse
 * 4.   browse/by-corridor
 * 5.   categories/places
 * 6.   categories/cuisines
 * 7.   discover/around
 * 8.   discover/explore
 * 9.   discover/here
 * 10.  discover/search
 * 11.  health
 * 12.  lookup
 * 
*/

'use strict';
const create_handler    = require("azure-function-express").createHandler;
const cosmos_db_worker  = require("./lib/dbOperations");
const axios_fetch_url   = require("./lib/axiosAsyncFetch");
const cosmosdblogger    = require("./lib/cosmosDbLogger");
const async_middleware  = require("./lib/asyncMiddleware");

const app = require("express")();

//API endpoint for places
const HERE_API_CIT  = 'https://places.cit.api.here.com/places/'
const HERE_API_LIVE = 'https://places.api.here.com/places/'

//HERE credentials App_Code and App_Id
const HERE_APP_CODE = process.env.HERE_APP_CODE;
const HERE_APP_ID   = process.env.HERE_APP_ID;

//Cosmos DB related parameters.
const HERE_COSMOSDB_ENDPOINT = process.env.HERE_COSMOSDB_ENDPOINT;
const HERE_COSMOSDB_KEY      = process.env.HERE_COSMOSDB_KEY;

const HERE_SERVICEBUS_CONNECTIONSTRING = process.env.HERE_SERVICEBUS_CONNECTIONSTRING;

const database_id   = "HERE_API_LOGS"
const container_id  = "places"


//Find and set environment. ( non-live cases set to CIT as default )
let HERE_API_URL =  process.env.HERE_ENVIRONMENT == "live" ?  HERE_API_LIVE : HERE_API_CIT ;

// Binds the express app to an Azure Function handler
module.exports = create_handler(app);
  
//Create COSMOS_DB database & container.
var cosmos_db = new cosmos_db_worker(HERE_COSMOSDB_ENDPOINT,HERE_COSMOSDB_KEY,database_id,container_id);
cosmos_db.createDB()
  .then(function(result){console.log(result);})
  .catch(function(err){console.log(err)});


//Entry point for function invocation :
module.exports = async function(context, serviceBusMsg) {
  context.log('JavaScript ServiceBus queue trigger function processed message', serviceBusMsg);

  //Log Environment Variable & Values.
  context.log(`[HERE_APP_ID]            : [${HERE_APP_ID}]`);
  context.log(`[HERE_APP_CODE]          : [${HERE_APP_CODE}]`);
  context.log(`[HERE_ENVIRONMENT]       : [${process.env.HERE_ENVIRONMENT}]`);
  context.log(`[HERE_API_URL]           : [${HERE_API_URL}]`);
  context.log(`[HERE_COSMOSDB_ENDPOINT] : [${HERE_COSMOSDB_ENDPOINT}]`);
  context.log(`[HERE_COSMOSDB_KEY]      : [${HERE_COSMOSDB_KEY}]`);
  context.log(`[HERE_SERVICEBUS_CONNECTIONSTRING] : [${HERE_SERVICEBUS_CONNECTIONSTRING}]`);

  
  //Parse incoming serviceBusMsg.
  //incoming msg format ( need to change after discussion )
  /*{
      "uid" : "unique_msg_id_uuid",
      "req_type" : "url/paramquery"
      "url" : "http://places.here/com/places/v1/asdf=asdf&asdf=asf&r34=45"  
      "params" : "param string."
      "query : {
        at="1324"
        q="asdf"
      }
  }
  */

  //Scan Incoming Service bus msg.
  var incomingMsgJson; 
  try {
    incomingMsgJson = JSON.parse(JSON.stringify(serviceBusMsg));
  }
  catch(err){
    context.log("JSON parsing for incoming msg failed \n ServiceBusMessage: [" + JSON.stringify(serviceBusMsg) +"] \n Error: " + err);
  }

  var req_type = incomingMsgJson.req_type;
  var url = "";
  if (req_type == "url") {
    //Build Proxy API URL  
    url = `${incomingMsgJson.url}&app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}` ;
  }

  //Logging original and Proxy URL:
  context.log("[incoming servicebus message contains URL] : [" +  incomingMsgJson.url + "]");
  context.log(`[Proxy HERE API service   URL]             : [${url}]`);
  
  //Fetch Response
  let response = await axios_fetch_url(url);
    
  //Delete content-length header as some api responses will be gzipped and then expanded.
  //If  add/modify/delete for header is required, it need to be done here.
  delete response.headers['content-length'];
    
  //Modify received response after intercepting it, if required.
  
  //Prepare JSON formatted log for storing in Cosmos DB. 
  context.log("Preparing Service Bus Msg Log for COSMOS DB.");

  var logEntry  = cosmosdblogger.prepareServiceBusLog(url,incomingMsgJson,response);

  context.log("Service Bus Msg Log for COSMOS DB prepared successfully.");

  //Store prepared log entry in Cosmos DB.
  cosmos_db.createLogEntry(logEntry)
    .then(function(result){context.log("CosmosDB Write OK: " + result);})
    .catch(function(err){context.log("CosmosDB Write Err : " + err)});

};
/* EOF */

