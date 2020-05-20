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

//  AuthUrls are to be used for APIKey or Authentication using token.
let authUrls = {
    // Make sure that configured URLs always end with trailing '/' char.
    // Position API URL
    "HERE_POS_URL": 'https://pos.ls.hereapi.com/positioning/',

    // Geocoder API URL
    "HERE_GEOCODE_URL": 'https://geocode.search.hereapi.com/',
    "HERE_DISCOVER_URL": 'https://discover.search.hereapi.com/',
    "HERE_AUTOSUGGEST_URL":'https://autosuggest.search.hereapi.com/',
    "HERE_BROWSE_URL":'https://browse.search.hereapi.com/',
    "HERE_LOOKUP_URL":'https://lookup.search.hereapi.com/',
    "HERE_REVGEOCODE_URL":'https://revgeocode.search.hereapi.com/',
    "HERE_BATCH_GEOCODER_URL": 'https://batch.geocoder.ls.hereapi.com/',
    // Map Image API URL
    "HERE_MAP_IMAGE_URL": 'https://image.maps.ls.hereapi.com/',

   // Routing API URL
    "HERE_CALCULATE_ROUTE_URL": 'https://router.hereapi.com/',
    "HERE_ROUTING_ISOLINE_URL": 'https://isoline.route.ls.hereapi.com/routing/',
    "HERE_ROUTING_MATRIX_URL": 'https://matrix.route.ls.hereapi.com/routing/',

    // MAap Tile API URL
    "HERE_MAPTILE_AERIAL_URL": 'https://1TO4.aerial.maps.ls.hereapi.com/',
    "HERE_MAPTILE_BASE_URL": 'https://1TO4.base.maps.ls.hereapi.com/',
    "HERE_MAPTILE_PANO_URL": 'https://1TO4.pano.maps.ls.hereapi.com/',
    "HERE_MAPTILE_TRAFFIC_URL": 'https://1TO4.traffic.maps.ls.hereapi.com/',

    // Fleet Telematics API URL
    "HERE_FLEET_TELEMATICS_URL": "https://fleet.ls.hereapi.com/",

    //Public Transit API URL
    "HERE_PUBLIC_TRANSIT_URL": 'https://transit.hereapi.com/v8/'
};

let cosmosDB = {
        databaseId: "HERE_API_LOGS",
        containerId: "here_api_logs",

        // Different containers for different apis.
        containerId_positioning: "positioning",
        containerId_geocoder: "geocoder",
        containerId_mapImage: "mapImage",
        containerId_mapTile: "mapTile",
        containerId_routing: "routing",
        containerId_fleetTelematics: "fleetTelematics",
        containerId_publicTransit: "publicTransit"
    }
    // serverlessExpressHandler ( possible express serverless module to be used.)
    // Available options are 
    // 1. azure  -> azure-funciton-express #intermittent bugs present
    // 2. azure-aws ->azure-aws-serverless-express

let serverlessExpressHandler = "azure-aws";

// httpClient , this is used to call proxy HERE API URL and to get the response back.
// Available options are 
// 1. axios
// 2. got

let httpClient = "axios";

// Azure Logging : possible values : 
// true : logs are enabled.
// false : logs are disabled.

let loggerEnabled = true;

module.exports = {
    authUrls: authUrls,
    serverlessExpressHandler: serverlessExpressHandler,
    httpClient: httpClient,
    loggerEnabled: loggerEnabled,
    cosmosDB: cosmosDB
}
