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
const axios_fetch_url   = require("./lib/axiosAsyncFetch");
const async_middleware  = require("./lib/asyncMiddleware");

const app = require("express")();

//API endpoint for places
const HERE_API_CIT  = 'https://places.cit.api.here.com/places/'
const HERE_API_LIVE = 'https://places.api.here.com/places/'

//HERE credentials App_Code and App_Id
const HERE_APP_CODE = process.env.HERE_APP_CODE;
const HERE_APP_ID   = process.env.HERE_APP_ID;


//Find and set environment. ( non-live cases set to CIT as default )
let HERE_API_URL =  process.env.HERE_ENVIRONMENT == "live" ?  HERE_API_LIVE : HERE_API_CIT ;

// Binds the express app to an Azure Function handler
module.exports = create_handler(app);
  
//express based generic route handler.
app.all("/api/places/*", async_middleware(async (req, res) => {
  
  req.context.log('HTTP serverless-function for "Here->places->REST_API" start.');
  var pretty_print = false;

  //Log Environment Variable & Values.
  req.context.log(`[HERE_APP_ID]            : [${HERE_APP_ID}]`);
  req.context.log(`[HERE_APP_CODE]          : [${HERE_APP_CODE}]`);
  req.context.log(`[HERE_ENVIRONMENT]       : [${process.env.HERE_ENVIRONMENT}]`);
  req.context.log(`[HERE_API_URL]           : [${HERE_API_URL}]`);
    

  //Find the passed parameters in url.
  req.context.log(`[Original Query params]  : [${JSON.stringify(req.params)}]`);

  //Build a dynamically created querystring.
  var here_query_string = ""
  for ( var key in req.query )  { 
    here_query_string += "&" + key + "=" + req.query[key] ; 
    if (key == "pretty" && req.query[key] == "true" ){  pretty_print = true;   }
  }


  //Build Proxy API URL  
  const url = `${HERE_API_URL}${req.params[0]}?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}` + here_query_string;
  req.context.log(`[Orginal URL]            : [${JSON.stringify(req.url)}]`);
  req.context.log(`[Proxy   URL]            : [${url}]`);
    
  //Fetch Response
  let response = await axios_fetch_url(url);
    
  //Delete content-length header as some api responses will be gzipped and then expanded.
  //If  add/modify/delete for header is required, it need to be done here.
  delete response.headers['content-length'];
    
  //Modify received response after intercepting it, if required.
  
  //Set response headers as received from underlying HERE API.
  for ( var key in response.headers )  { 
    res.set(key,response.headers[key]);
  }
  //Add CORS Header for all responses 
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  //Set response status code as received from underlying HERE API.
  res.status(response.status);

  //Sending the response, generic pretty_print handling applies to all URI.
  (pretty_print == true ) ?  res.send(JSON.stringify(response.body,null,4)) :  res.send(response.body);
  req.context.log('Response sent successfully.');
})); 
 
/* EOF */
