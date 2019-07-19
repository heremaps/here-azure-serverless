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

function getAzureHandler() {

    const config = require("../hereLibs/configurations");
    const serverlessExpressHandler = config.serverlessExpressHandler;

    let azure_handler;

    if (serverlessExpressHandler == "azure") {

        azure_handler = require("azure-function-express").createHandler;

    } else if (serverlessExpressHandler == "azure-aws") {

        azure_handler = require('azure-aws-serverless-express');

    } else {

        // eslint-disable-next-line no-console
        console.error("[Error]: Check serverlessExpressHandler in hereLibs/configurations.");
        //set default to azure-aws handler.
        azure_handler = require('azure-aws-serverless-express')

    }
    return azure_handler;
}


module.exports =  getAzureHandler;
