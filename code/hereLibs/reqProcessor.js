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

const httpClient = require("../hereLibs/httpClient.js");
const config = require("../hereLibs/configurations");
const normalizeHeaderCase = require("header-case-normalizer");

// applicable for URLs where we have choice from 1-4 servers. this returns dynamically any value between 1-4.
function chooseRandomServer() {
    const max = 4;
    const min = 1;
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// invoke proxy HERE API url and fetch its response.
async function getEventResult(log, req) {

    log(`[Fetching Proxy Response]: [BEGIN]`);

    var result;

    if (req._proxy.method.toUpperCase() == "GET") {
        result = await httpClient.async_get(req._proxy.url);

    } else if (req._proxy.method.toUpperCase() == "POST") {
        result = await httpClient.async_post(req._proxy.url, req._proxy.body, req._proxy.contenttype);
    }

    for (var key in result.headers) {
        // compression middleware uses headers in format "Content-Length"
        // whereas we get header in azure platform as "content-length" ( all small-case)
        // conversion is to ensure that headers remains usable across stack. 
        result.headers[normalizeHeaderCase(key)] = result.headers[key];
        delete result.headers[key];
    }

    // multiple cookies doesnt work with serverless express handler.
    delete result.headers['Set-Cookie'];

    log(`[Proxy Response Status  ]: [${result.status}]`);
    log(`[Proxy Content-Length   ]: [${result.headers['Content-Length']}]`);
    log(`[Proxy Content-Type     ]: [${result.headers['Content-Type']}]`);
    log(`[Proxy Content-Encoding ]: [${result.headers['Content-Encoding']}]`);

    // Modify received response after intercepting it, if required.
    log(`[Fetching Proxy Response]: [END]`);
    return result;
}

async function getAPIResult(log, req, proxyUrl) {
    log(`[Fetching Proxy Response]: [BEGIN]`);
    var result;
    if (req.method.toUpperCase() == "GET") {
        result = await httpClient.async_get(proxyUrl);
    } else if (req.method.toUpperCase() == "POST") {
        result = await httpClient.async_post(proxyUrl, req.body, req.headers['content-type']);
    }

    for (var key in result.headers) {
        // compression middleware uses headers in format "Content-Length"
        // whereas we get header in azure platform as "content-length" ( all small-case)
        // conversion is to ensure that headers remains usable across stack. 
        result.headers[normalizeHeaderCase(key)] = result.headers[key];
        delete result.headers[key];
    }

    // multiple cookies doesnt work with serverless express handler.
    delete result.headers['Set-Cookie'];
    log(`[Proxy Response Status  ]: [${result.status}]`);
    log(`[Proxy Content-Length   ]: [${result.headers['Content-Length']}]`);
    log(`[Proxy Content-Type     ]: [${result.headers['Content-Type']}]`);
    log(`[Proxy Content-Encoding ]: [${result.headers['Content-Encoding']}]`);

    // Modify received response after intercepting it, if required.
    log(`[Fetching Proxy Response]: [END]`);
    return result;
}

// Dynamically build HERE API URL to be used by various apis.
function buildHereApiUrl(req) {
    var url = ""

    switch (req.api) {
        case "routing":
            url = getRoutingApiUrl(req);
            break;
        case "positioning":
            url = getPositioningApiUrl();
            break;
        case "map_tile/aerial":
        case "map_tile/base":
        case "map_tile/pano":
        case "map_tile/traffic":
            url = getMapTileApiUrl(req);
            break;
        case "fleet":
            url = getFleetTelematicsUrl();
            break;
        case "map_image":
            url = getMapImageUrl();
            break;
        case "geocoder":
            url = getGeocoderUrl(req);
            break;
        case "public_transit":
            url = getPublicTransitApiUrl();
            break;

        default:
            var errorMsg = "HERE_API_URL mapping not found , incoming message [req.api] = [" + req.api + "]";
            req._error = errorMsg;
            return false; // Default return false.
    }
    req._config.HERE_API_URL = url;
    return true;
}

function getRoutingApiUrl(req) {

    var url = ""
    if (req.url.indexOf("calculateisoline") > 0) {
        url = config.authUrls.HERE_ROUTING_ISOLINE_URL;
    } else if (req.url.indexOf("calculatematrix") > 0) {
        url = config.authUrls.HERE_ROUTING_MATRIX_URL;
    } else {
        url = config.authUrls.HERE_CALCULATE_ROUTE_URL;
    }
    return url;
}


function getPositioningApiUrl() {
    return config.authUrls.HERE_POS_URL;
}

function getMapTileApiUrl(req) {

    let randomServer = chooseRandomServer();
    if (req.api == "map_tile/aerial") {
        return config.authUrls.HERE_MAPTILE_AERIAL_URL.replace("1TO4", randomServer.toString())
    } else if (req.api == "map_tile/base") {
        return config.authUrls.HERE_MAPTILE_BASE_URL.replace("1TO4", randomServer.toString());
    } else if (req.api == "map_tile/pano") {
        return config.authUrls.HERE_MAPTILE_PANO_URL.replace("1TO4", randomServer.toString());
    } else if (req.api == "map_tile/traffic") {
        return config.authUrls.HERE_MAPTILE_TRAFFIC_URL.replace("1TO4", randomServer.toString());
    }
    return "NOTFOUND" // Default to ""(empty str) .
}

function getFleetTelematicsUrl() {
    return config.authUrls.HERE_FLEET_TELEMATICS_URL;
}

function getMapImageUrl() {
    return config.authUrls.HERE_MAP_IMAGE_URL
}

function getGeocoderUrl(req) {
    if (req.url.indexOf("discover") >= 0) {
        return config.authUrls.HERE_DISCOVER_URL;
    } else if (req.url.indexOf("autosuggest") >= 0) {
        return config.authUrls.HERE_AUTOSUGGEST_URL;
    }
    else if (req.url.indexOf("browse") >= 0) {
        return config.authUrls.HERE_BROWSE_URL;
    }
    else if (req.url.indexOf("lookup") >= 0) {
        return config.authUrls.HERE_LOOKUP_URL;
    }
    else if (req.url.indexOf("revgeocode") >= 0) {
        return gconfig.authUrls.HERE_REVGEOCODE_URL;
    }
    return config.authUrls.HERE_GEOCODE_URL;
}

function getPublicTransitApiUrl(){
    return config.authUrls.HERE_PUBLIC_TRANSIT_URL;
}

function processRequestAuthKey(log, req, HERE_API_KEY, HERE_API_URL) {

    // Log Environment Variable & Values.
    log(`[HERE_API_KEY]            : [${HERE_API_KEY}]`);
    log(`[HERE_API_URL]            : [${HERE_API_URL}]`);

    // Find the passed parameters in url.
    log(`[Original Query params]  : [${JSON.stringify(req.params[0])}]`);

    log(`[Request Query String]   : [${JSON.stringify(req.query, null, 4)}]`);
    log(`[Request RAW QueryString]: [${req._parsedUrl.query}]`);

    log(`[Request Method]         : [${req.method}]`);
    log(`[Request ContentType]    : [${req.headers['content-type']}]`);

    // Prepare proxy-URL ( for here api )
    let here_query_string = req._parsedUrl.query;
    if (req._parsedUrl.query == null) {
        here_query_string = ""
    }
    let proxy_url = `${HERE_API_URL}${req.params[0]}?apikey=${HERE_API_KEY}` + "&" + here_query_string;

    log(`[Orginal URL]            : [${JSON.stringify(req.url)}]`);

    // Sanitize proxy URL, its requried for map-tile for now.
    proxy_url = sanitizieUrl(proxy_url);
    log(`[Proxy   URL]            : [${proxy_url}]`);
    log(`[Proxy Body ]            : [${JSON.stringify(req.body, null, 4)}]`);

    return proxy_url;
}


function classifyRespFormat(req) {
    if (req.params != undefined) {
        if (req.params[0].indexOf(".json") > 0) {
            return "json"
        }
        if (req.params[0].indexOf(".xml") > 0) {
            return "xml"
        }
        return "json" // Default to "json".
    }

    return "json";
}

function sendResponse(log, req, res, result) {

    log(`[Sending Response]       : [BEGIN]`);

    // Set result headers as received from underlying HERE API.
    for (var key in result.headers) {
        res.set(key, result.headers[key]);
    }

    // Add CORS Header for all result 
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Set response status code as received from underlying HERE API.
    res.status(result.status);

    // Sending the response, display of the response is based on content-type. 
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
    processRequestAuthKey: processRequestAuthKey,
    sendResponse: sendResponse,
    classifyRespFormat: classifyRespFormat,
    getAPIResult: getAPIResult,
    getEventResult: getEventResult,
    chooseRandomServer: chooseRandomServer,
    buildHereApiUrl: buildHereApiUrl
}
