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

 
/**
 * TODO : 
 * 1. Put timeout in URL Fetch,if request is stuck, it need to exit without stuck for long.
 * 2. POST image response is to be imlpemented, no request seen for this kind yet.
 */

// const azure_handler = ( serverlessExpressHandler == "aws") ? require("azure-function-express").createHandler :  require('azure-aws-serverless-express') ;
function getAzureHandler(){

    const config          = require("../here_libs/configurations");
    const serverlessExpressHandler = config.serverlessExpressHandler;

    let azure_handler;

    if ( serverlessExpressHandler == "azure") {

        azure_handler  = require("azure-function-express").createHandler;

    }else if ( serverlessExpressHandler == "azure-aws" ) {

        azure_handler  = require('azure-aws-serverless-express');

    }
    else {

        console.error("[Error]: Check serverlessExpressHandler in here_libs/configurations.");
        //set default to azure-aws handler.
        azure_handler  = require('azure-aws-serverless-express')

    }
    return azure_handler;
}
module.exports =  getAzureHandler;
