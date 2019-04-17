### Build script generates following artifacts

## ARM Templates
* Serverless Functions

    Deploys  7 HERE Loction suite API as Azure functions.
    ```
    Template :  ./armTemplates/100-hlsARMTemplateServerlessFunctions/azuredeploy.json
    Build zip file : ./dist/deployables/azureMarketplace/hlsTemplateServerlessFunction.zip
    ```
* DataStreams

    Deploys event-hub, 7 HERE Locaiton suite API as functions and Cosmos DB.
    ```
    Template : ./armTemplates/102-hlsARMTemplateDataStream/azuredeploy.json
    Build zip file : ./dist/deployables/azureMarketplace/hlsTemplateDataStream.zip
    ```

* WebApp Backend

    Deploys service-bus, 7 HERE Locaiton suite API as functions and Cosmos DB.
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
* Data Streams
    ```
    Template : ./solutionTemplates/hlsSolutionTemplateDataStream
    Build zip file : ./dist/deployables/azureMarketplacePublishing/hlsSolutionTemplateDataStream.zip
    ```

* WebApp Backend 
    ```
    Template : ./solutionTemplates/hlsSolutionTemplateWebAppBackend
    Build zip file : ./dist/deployables/azureMarketplacePublishing/hlsSolutionTemplateWebAppBackend.zip
    ```


## Serverless Library : individual function proxies with own ARM template


* Fleet Telematics :
    ```
    Template : ./armTemplates/103-hlsARMTemplateServerlessFunctionFleetTelematics/azuredeploy.json
    Build zip file : ./dist/deployables/serverlesslibrary/hlsAPIFleetTelematics.zip
    ```

* Geocoder : 
    ```
    Template : ./armTemplates/104-hlsARMTemplateServerlessFunctionGeocoder/azuredeploy.json
    Build zip file : ./dist/deployables/serverlesslibrary/hlsAPIGeocoder.zip
    ```


* Places : 
    ```
    Template : ./armTemplates/105-hlsARMTemplateServerlessFunctionPlaces/azuredeploy.json
    Build zip file : ./dist/deployables/serverlesslibrary/hlsAPIPlaces.zip
    ```


* Positioning : 
    ```
    Template : ./armTemplates/106-hlsARMTemplateServerlessFunctionPositioning/azuredeploy.json
    Build zip file : ./dist/deployables/serverlesslibrary/hlsAPIPositioning.zip
    ```

    
* Routing : 
    ```
    Template : ./armTemplates/107-hlsARMTemplateServerlessFunctionRouting/azuredeploy.json
    Build zip file : ./dist/deployables/serverlesslibrary/hlsAPIRouting.zip
    ```


* Map Image : 
    ```
    Template : ./armTemplates/108-hlsARMTemplateServerlessFunctionMapImage/azuredeploy.json
    Build zip file : ./dist/deployables/serverlesslibrary/hlsAPIMapImage.zip
    ```

    
* Map Tile : 
    ```
    Template : ./armTemplates/109-hlsARMTemplateServerlessFunctionMapTile/azuredeploy.json
    Build zip file : ./dist/deployables/serverlesslibrary/hlsAPIMapTile.zip
    ```

