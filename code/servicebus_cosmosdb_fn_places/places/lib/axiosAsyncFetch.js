const axios = require("axios");

function axios_async_fetch(url){
    return new Promise((resolve, reject) => {
        var jsonResp= new Object();
        axios
        .get(url)
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
                resolve(jsonResp);
            }
        });
    })
}

module.exports = axios_async_fetch;
