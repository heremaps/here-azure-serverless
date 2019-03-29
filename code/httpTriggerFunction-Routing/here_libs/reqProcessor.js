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

 
const httpClient = require("../here_libs/httpClient.js");
const normalizeHeaderCase = require("header-case-normalizer");


function processRequest(log, req, HERE_APP_CODE, HERE_APP_ID, HERE_API_URL) {

  //Log Environment Variable & Values.
  log(`[HERE_APP_ID]            : [${HERE_APP_ID}]`);
  log(`[HERE_APP_CODE]          : [${HERE_APP_CODE}]`);
  log(`[HERE_API_URL]           : [${HERE_API_URL}]`);

  //Find the passed parameters in url.
  log(`[Original Query params]  : [${JSON.stringify(req.params[0])}]`);

  log(`[Request Query String]   : [${JSON.stringify(req.query,null,4)}]`);
  log(`[Request RAW QueryString]: [${req._parsedUrl.query}]`);

  log(`[Request Method]         : [${req.method}]`);
  log(`[Request ContentType]    : [${req.headers['content-type']}]`);

  //Prepare proxy-URL ( for here api )
  let here_query_string = req._parsedUrl.query;
  if ( req._parsedUrl.query == null) {
    here_query_string = ""
  }
  let proxy_url = `${HERE_API_URL}${req.params[0]}?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}` + "&" + here_query_string;

  log(`[Orginal URL]            : [${JSON.stringify(req.url)}]`);

  //Sanitize proxy URL, its requried for map-tile for now.
  proxy_url = sanitizieUrl(proxy_url);
  log(`[Proxy   URL]            : [${proxy_url}]`);
  log(`[Proxy Body ]            : [${JSON.stringify(req.body,null,4)}]`);

  return proxy_url;
}

function chooseRandomServer() {
  const max = 4;
  const min = 1;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function classifyRespFormat(req) {
  if (req.params != undefined) {
    if (req.params[0].indexOf(".json") > 0) {
      return "json"
    }
    if (req.params[0].indexOf(".xml") > 0) {
      return "xml"
    }
    return "json" //Default to "json".
  }

  return "json";
}

async function getAPIResult(log, req, proxy_url) {
  log(`[Fetching Proxy Response]: [BEGIN]`);

  var result;
  
  if (req.method.toUpperCase() == "GET") {
  
    result = await httpClient.async_get(proxy_url);
  
  } else if (req.method.toUpperCase() == "POST") {

    result = await httpClient.async_post(proxy_url, req.body, req.headers['content-type']);
  }

  for (var key in result.headers) {
    //compression middleware uses headers in format "Content-Length"
    //whereas we get header in azure platform as "content-length" ( all small-case)
    //conversion is to ensure that headers remains usable across stack. 
    result.headers[normalizeHeaderCase(key)] = result.headers[key];
    delete result.headers[key];

  }
  
  //multiple cookies doesnt work with serverless express handler.
  delete result.headers['Set-Cookie'];
  
  log(`[Proxy Response Status  ]: [${result.status}]`);
  log(`[Proxy Content-Length   ]: [${result.headers['Content-Length']}]`);
  log(`[Proxy Content-Type     ]: [${result.headers['Content-Type']}]`);
  log(`[Proxy Content-Encoding ]: [${result.headers['Content-Encoding']}]`);

  //Modify received response after intercepting it, if required.

  log(`[Fetching Proxy Response]: [END]`);
  return result;

}


function sendResponse(log, req, res, result) {

  log(`[Sending Response]       : [BEGIN]`);

  //Set result headers as received from underlying HERE API.
  for (var key in result.headers) {
    res.set(key, result.headers[key]);
  }

  //Add CORS Header for all result 
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


  //Set response status code as received from underlying HERE API.
  res.status(result.status);

  //Sending the response, display of the response is based on content-type. 
  if (result.headers['Content-Type'].toLowerCase().indexOf("json") >= 0) {
    log(`[Sending Response][JSON] : [END]`);
    res.send(result.body);

  } else if (result.headers['Content-Type'].toLowerCase().indexOf("xml") >= 0) {
    log(`[Sending Response][XML]  : [END]`);
    res.send(result.body);

  } else if (result.headers['Content-Type'].toLowerCase().indexOf("image") >= 0) {
    let img_to_send = new Buffer(result.body.toString('binary'), 'base64');
    log(`[Sending Response][IMAGE]: [END]`);

    res.send(img_to_send);
  } else {
    log(`[Sending Response][*]    : [END]`);
    res.send(result.body);
  }


}

function sanitizieUrl(url) {
  //this function removes extra param passed for base URL identification.
  if (url.indexOf("maps.api.here.com/aerial/") > 0) {
    return url.replace("maps.api.here.com/aerial/", "maps.api.here.com/")
  } else if (url.indexOf("maps.api.here.com/base/") > 0) {
    return url.replace("maps.api.here.com/base/", "maps.api.here.com/")
  } else if (url.indexOf("maps.api.here.com/pano/") > 0) {
    return url.replace("maps.api.here.com/pano/", "maps.api.here.com/")
  } else if (url.indexOf("maps.api.here.com/traffic/") > 0) {
    return url.replace("maps.api.here.com/traffic/", "maps.api.here.com/")
  }
  //Default "Unchanged URL returned"
  return url;
}
module.exports = {
  processRequest: processRequest,
  getAPIResult: getAPIResult,
  sendResponse: sendResponse,
  classifyRespFormat: classifyRespFormat,
  chooseRandomServer: chooseRandomServer
}
