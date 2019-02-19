
var cosmosdblogger = {};
cosmosdblogger.prepareHttpReqLog = function (here_url,req,response) {

    var log_date =  new Date().toISOString();
    var logEntry = {
        id_tstamp    : log_date,
        original_url : req.url,
        here_url     : here_url,
        http_status  : response.status,
        req_headers  : req.headers,
        res_headers  : response.headers,
        api_result   : response.body
     };

    return logEntry;
};
cosmosdblogger.prepareServiceBusLog = function (here_url,req,response) {

    var log_date =  new Date().toISOString();
    var logEntry = {
        id_tstamp    : log_date,
        req_uid      : req.uid,
        original_url : req.url,
        here_url     : here_url,
        http_status  : response.status,
        res_headers  : response.headers,
        api_result   : response.body
     };

    return logEntry;
}
module.exports = cosmosdblogger;
