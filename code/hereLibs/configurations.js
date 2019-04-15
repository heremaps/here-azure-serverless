
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

URL for different APIs are configured here 
These URLs are actually used in serverless function as needed.

*/
let urls = {
  //Make sure that configured URLs always end with trailing '/' char.

  //Position API URL
  "HERE_POS_URL"                    : 'https://pos.api.here.com/positioning/',
  
  //GeoCode API URL
  "HERE_GEOCODER_URL"               : 'https://geocoder.api.here.com/',
  "HERE_BATCH_GEOCODER_URL"         : 'https://batch.geocoder.api.here.com/',
  "HERE_AUTOCOMPLETE_GEOCODER_URL"  : 'http://autocomplete.geocoder.api.here.com/',
  "HERE_REVERSE_GEOCODER_URL"       : 'https://reverse.geocoder.api.here.com/',
  
  //Map Image API URL
  "HERE_MAP_IMAGE_URL"              : 'https://image.maps.api.here.com/',
  
  //Places API URL
  "HERE_PLACES_URL"                 : 'https://places.api.here.com/places/',
  
  //Routing API URL
  "HERE_ROUTING_URL"                : 'https://route.api.here.com/routing/',
  "HERE_ROUTING_ISOLINE_URL"        : 'https://isoline.route.api.here.com/routing/',
  "HERE_ROUTING_MATRIX_URL"         : 'https://matrix.route.api.here.com/routing/',

  //MAap Tile API URL
  "HERE_MAPTILE_AERIAL_URL"         : 'https://1TO4.aerial.maps.api.here.com/',
  "HERE_MAPTILE_BASE_URL"           : 'https://1TO4.base.maps.api.here.com/',
  "HERE_MAPTILE_PANO_URL"           : 'https://1TO4.pano.maps.api.here.com/',
  "HERE_MAPTILE_TRAFFIC_URL"        : 'https://1TO4.traffic.maps.api.here.com/',

  //Fleet Telematics API URL
  "HERE_FLEET_TELEMATICS_URL"       : "https://fleet.api.here.com/"
};

let cosmosDB = {
  
  databaseId  : "HERE_API_LOGS",
  containerId : "here_api_logs",

  //Different containers for different apis.
  containerId_places : "places",
  containerId_positioning : "positioning",
  containerId_geocoder : "geocoder",
  containerId_mapImage : "mapImage",
  containerId_mapTile : "mapTile",
  containerId_routing : "routing",
  containerId_fleetTelematics : "fleetTelematics",

}
//serverlessExpressHandler ( possible express serverless module to be used.)
//available options are 
//1. azure  -> azure-funciton-express
//2. azure-aws ->azure-aws-serverless-express

let serverlessExpressHandler = "azure-aws";

//httpClient , this is used to call proxy HERE API URL and to get the response back.
//available options are 
//1. axios
//2. got

let httpClient = "axios";

//Azure Logging : possible values : 
//true : logs are enabled.
//false : logs are disabled.

let loggerEnabled = true;

module.exports = { 
    urls    : urls,
    serverlessExpressHandler : serverlessExpressHandler,
    httpClient : httpClient,
    loggerEnabled : loggerEnabled,
    cosmosDB : cosmosDB
}
