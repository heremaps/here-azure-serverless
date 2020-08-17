### Build This Project

Build script - `build.sh` -  generates artifacts below.

As a prerequisite, you must have the following tools installed on your machine:

* [NodeJS](https://nodejs.org) (Install an LTS version.)
* [Microsoft dotnet SDK](https://dotnet.microsoft.com/download)
* [Azure Functions Core tools 2.x](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)

`$ ./build.sh`

The build script creates a `dist` folder, where the required `npm packages` and the Azure extension are installed.

## ARM Templates
* Serverless Functions
    Creates 7 HERE Location Services APIs as Azure functions.
    ```
    Template :  ./armTemplates/100-hlsARMTemplateServerlessFunctions/azuredeploy.json
    Build zip file : ./dist/deployables/azureMarketplace/hlsTemplateServerlessFunction.zip
    ```
* DataStreams
    Creates event-hub, 7 HERE Location Services APIs as functions and Cosmos DB.
    ```
    Template : ./armTemplates/102-hlsARMTemplateDataStream/azuredeploy.json
    Build zip file : ./dist/deployables/azureMarketplace/hlsTemplateDataStream.zip
    ```
* WebApp Backend
    Creates service-bus, HERE Location Services APIs as functions and Cosmos DB.
    ```
    Template : ./armTemplates/101-hlsARMTemplateWebAppBackend/azuredeploy.json
    Build zip file : ./dist/deployables/azureMarketplace/hlsTemplateWebAppBackend.zip
    ```

## Marketplace Solution Templates

These are same as ARM Templates but additionally wrapped inside solution template for publishing on marketplace.

* Serverless Functions 
    ```
    Template : ./solutionTemplates/hlsSolutionTemplateServerlessFunction
    Build zip file : ./dist/deployables/azureMarketplacePublishing/hlsSolutionTemplateServerlessFunction.zip
    ```
* Data Streams:
    ```
    Template : ./solutionTemplates/hlsSolutionTemplateDataStream
    Build zip file : ./dist/deployables/azureMarketplacePublishing/hlsSolutionTemplateDataStream.zip
    ```
* WebApp Backend:
    ```
    Template : ./solutionTemplates/hlsSolutionTemplateWebAppBackend
    Build zip file : ./dist/deployables/azureMarketplacePublishing/hlsSolutionTemplateWebAppBackend.zip
    ```


## Serverless Library : individual function proxies with own ARM template

* Fleet Telematics API:
    ```
    Template : ./armTemplates/103-hlsARMTemplateServerlessFunctionFleetTelematics/azuredeploy.json
    Build zip file : ./dist/deployables/serverlesslibrary/hlsAPIFleetTelematics.zip
    ```
* Geocoding and Search API v7 : 
    ```
    Template : ./armTemplates/104-hlsARMTemplateServerlessFunctionGeocoder/azuredeploy.json
    Build zip file : ./dist/deployables/serverlesslibrary/hlsAPIGeocoder.zip
    ```
* Positioning API: 
    ```
    Template : ./armTemplates/106-hlsARMTemplateServerlessFunctionPositioning/azuredeploy.json
    Build zip file : ./dist/deployables/serverlesslibrary/hlsAPIPositioning.zip
    ```
* Routing API: 
    ```
    Template : ./armTemplates/107-hlsARMTemplateServerlessFunctionRouting/azuredeploy.json
    Build zip file : ./dist/deployables/serverlesslibrary/hlsAPIRouting.zip
    ```
* Map Image API: 
    ```
    Template : ./armTemplates/108-hlsARMTemplateServerlessFunctionMapImage/azuredeploy.json
    Build zip file : ./dist/deployables/serverlesslibrary/hlsAPIMapImage.zip
    ```
* Map Tile API: 
    ```
    Template : ./armTemplates/109-hlsARMTemplateServerlessFunctionMapTile/azuredeploy.json
    Build zip file : ./dist/deployables/serverlesslibrary/hlsAPIMapTile.zip
    ```
* Public Transit API: 
    ```
    Template : ./armTemplates/110-hlsARMTemplateServerlessFunctionPublicTransit/azuredeploy.json
    Build zip file : ./dist/deployables/serverlesslibrary/hlsAPIPublicTransit.zip
    ```
