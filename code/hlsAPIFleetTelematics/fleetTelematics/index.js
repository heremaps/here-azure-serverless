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

/* Azure Serverless Function for HERE Fleet Telematics API
 * Covers all resources available under fleet telematics as below.
 * 
 * Fleet Telematics Custom Locations
 * Fleet Telematics Custom Routes
 * Fleet Telematics Geofencing
 * Fleet Telematics Advanced Data Sets
 * Fleet Telematics Route Matching
 * Fleet Telematics Toll Costs
 * Fleet Telematics Waypoint Sequence
 */

'use strict';

const config = require("../hereLibs/configurations");
const serverlessHandler = require("../hereLibs/serverlessHandler")();
const asyncMiddleware = require("../hereLibs/asyncMiddleware");
const reqProcessor = require("../hereLibs/reqProcessor");
const loggers = require("../hereLibs/logger");
const app = require("express")();
const compression = require("compression");

// HERE credentials API Key
const HERE_API_KEY = process.env.HERE_API_KEY;

// Binds the express app to an Azure Function handler
app.use(compression());
module.exports = serverlessHandler(app);

// API URL
const HERE_API_URL = config.authUrls.HERE_FLEET_TELEMATICS_URL;

app.all("/api/fleet/*", asyncMiddleware(async(req, res) => {
    // get logger instance, ( it varies based on selection of express handler.)
    let logger = loggers.getLogger(req);

    // Process Request Object and Prepare Proxy URL using HERE APP Credentials. 
    let proxyUrl = reqProcessor.processRequestAuthKey(logger, req, HERE_API_KEY, HERE_API_URL);
    
    // Invoke Proxy URL and fetch Response, GET/POST call is decided based on incoming method.
    let result = await reqProcessor.getAPIResult(logger, req, proxyUrl);

    // Set the Response Object Headers ,StatusCode  and Response Body.
    reqProcessor.sendResponse(logger, req, res, result);
}));

