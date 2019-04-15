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

 
 
const config          = require("../hereLibs/configurations");
let httpClientValue   = config.httpClient;

let httpClient ;
if ( httpClientValue  == "axios" ) {
    const lib_axios     = require("../hereLibs/axiosAsyncFetch");
    httpClient = lib_axios;
} 
//More clients like "got" / "request" can be used and added here.
else {
    //default fallback to axios.
    const lib_axios     = require("../hereLibs/axiosAsyncFetch");
    httpClient = lib_axios;
}

module.exports =  httpClient;
