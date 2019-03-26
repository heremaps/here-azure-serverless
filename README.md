# ARM templates 
This section contains ARM templates which are used for provision required resources and deploy functions.

## Details of the templates :

### 1. 100-httpTriggerFunctionsTemplate

This template creates a standard storage account and a function app.  
additionally it deploys HTTP trigger functions for 7 Here APIs.  



### 2. 101-serviceBusTriggerFunctionsTemplate  

This template provisions "Servicebus", "cosmosDB", "function app"   
additionally it deploys Servicebus trigger functions for 7 Here APIs  
once the function executes , it stores its output in cosmosDB instance.  

### 3. 102-eventHubTriggerFunctionsTemplate  

This template provisions "eventHub", "cosmosDB", "function app"   
additionally it deploys single eventHub trigger functions catering to 7 Here APIs  
once the function executes , it stores its output in cosmosDB instance.  



## Supported List of APIs

1. Geocoder
2. Routing
3. Places
4. Positioning
5. Map Image
6. Map Tiles
7. Fleet Telematics


