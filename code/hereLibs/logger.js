
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

 const config      = require("../hereLibs/configurations");

function getLogger(req) {
    
    let loggerEnabled = config.loggerEnabled;
    let log;
    if (!loggerEnabled) {
        log = dumpLog;
    }
    else if (config.serverlessExpressHandler == "azure" && req.context ) {
        log = req.context.log ;
    }
    else if (req.log) {
        log = req.log ;
    }
    else {
        // eslint-disable-next-line no-console
        log = console.log;
    }
    return log;
}

function dumpLog(){
    //do Nothing, as this function is to dump all the logs without processing.
}


module.exports =  {
    getLogger : getLogger,
};
