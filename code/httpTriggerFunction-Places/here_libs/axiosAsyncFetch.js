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
 */
const axios = require("axios");

module.exports = { 
    async_post : axios_async_post,
    async_get  : axios_async_get
   }

function axios_async_post(url,body,contentType){
    return new Promise((resolve, reject) => {
        var jsonResp= new Object();
       console.log("inside axios_async_post , body type : ",contentType);
       console.log("inside axios_async_post , body  : ",JSON.stringify(body,null,4));
       console.log("inside axios_async_post , url  : ",url);
       
       
        let axiosConfig = {
            headers: {
                'Content-Type': contentType,
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "No cache"
            }
          };
           
        axios 
        .post(url,body,axiosConfig)
        .then((res) => {
            let {
                data: json,
                status,
                message,
            } = res;
            if (json && status === 200) {
                jsonResp.status = 200;
                jsonResp.body = json;
                jsonResp.headers = res.headers;
                resolve(jsonResp);
            }
        })
        .catch((err) => {
            if (err.response) {
                jsonResp.status = err.response.status;
                jsonResp.body = err.response.data;
                jsonResp.headers = err.response.headers;
                console.log(JSON.stringify(jsonResp,null,4));
                resolve(jsonResp);
            }
        });
    })
};

function axios_async_get(url) {
    var jsonResp = new Object();
    let axiosConfig = {
        responseType: 'arraybuffer',
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    }
    return new Promise((resolve, reject) => {
    axios.get(url,axiosConfig)
    .then(response => {
        //in success scenario, we'll get 200 status code and image back.
        //convert this to base64 we will convert it to binary before sending back.
        //check if we got a image back by checking content-type 

        if ( (response.headers['content-type']).indexOf('image') >= 0 ) {
            jsonResp.body = Buffer.from(response.data, 'binary').toString('base64');
        } 
        else{
            jsonResp.body = Buffer.from(response.data, 'binary').toString();
        }
        jsonResp.headers = response.headers;
        jsonResp.status = 200;

        resolve(jsonResp);
    })
    .catch((err) => {

        if (err.response) {
            
            if ( (err.response.headers['content-type']).indexOf('image') >= 0 ) {
                jsonResp.body = Buffer.from(err.response.data, 'binary').toString('base64');
            } 
            else{
                jsonResp.body = Buffer.from(err.response.data, 'binary').toString();
            }

            jsonResp.headers = err.response.headers;
            jsonResp.status = err.response.status;
            
            resolve(jsonResp);
        }
    });
   });
};
