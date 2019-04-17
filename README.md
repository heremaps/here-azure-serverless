# Azure - HERE Location Suite Maps APIs

## Introduction
This project provides [Azure Functions](https://azure.microsoft.com/en-in/services/functions/) as __proxies__ for several of the [HERE Location Services APIs](https://developer.here.com/documentation). These Azure Functions are packaged as per the [Azure Resource Manager Template](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview).


Azure Resource Manager Template ( ARM Template) defines a simplified syntax for expressing serverless resources. 

### Benefits

Azure Serverless Compute scales from nothing to thousands of concurrent functions almost instantly to match workload, it react to event in near-real-time and there are scenarios where these functions can be integrated with frontend component like event-hub/service-bus and backend components like cosmos DB etc.

We welcome pull request for anything breaking, error handling etc.

## Requirements
To successfully call the HERE Maps APIs through the proxies in this project you need to obtain HERE API credentials. You can obtain a [Freemium plan](https://developer.here.com/plans?utm_medium=referral&utm_source=azure_marketplace_hlsfuntions&create=Freemium-Basic) to begin with.


## List of APIs with Azure Functions Proxies
* [geocode](https://developer.here.com/documentation/geocoder/topics/introduction.html) 
* [mapimage](https://developer.here.com/documentation/map-image/topics/introduction.html)
* [maptile](https://developer.here.com/documentation/map-tile/topics/overview.html)
* [places](https://developer.here.com/documentation/places/topics/introduction.html)
* [position](https://developer.here.com/documentation/positioning/topics/introduction.html)
* [routing](https://developer.here.com/documentation/routing/topics/overview.html) 
* [fleet telematics](https://developer.here.com/documentation/fleet-telematics/dev_guide/index.html)

## Setup
### Step 1: Register for an API Key

Visit the [Here Location Suite Freemium Plan](https://developer.here.com/plans?utm_medium=referral&utm_source=azure_marketplace_hlsfuntions&create=Freemium-Basic) to obtain app_id & app_code

app_id uniquely identifies your application.
app_code is used in the authentication process to identify a session.

### Step 2: Register an Azure Account

Visit [Azure](https://azure.microsoft.com/free/) and sign up for a Free Tier account.

### Step 3: Install the Azure CLI 

Download and install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli), and run `az login` as per the [Azure CLI User Guide](https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli?view=azure-cli-latest).

### Step 4: Get the Source

Clone this repository or download zip 

### Step 5: Build the code 
Build script is included at root level of this repo. As a pre-requisite you need to have below tools installed on machine.
* [NodeJS](https://nodejs.org) ( install an LTS Version)
* [Microsoft dotnet SDK](https://dotnet.microsoft.com/download)
* [Azure Functions Core tools 2.x](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)

`$ ./build.sh`

Build script will create `dist` folder which internally installs required `npm packages` and Azure extension.
What you will get after build is as below :

1) Three Marketplace Offerings ( Solution Template & zip file containing code & dependencies)   
* Data Streams ( provisions event-hub, serverless functions, cosmos DB)
* WebApp Backend ( provisions service-bus, serverless functions, cosmos DB)
* Serverless Functions ( provisions collection of HERE API functions.)

    
2) Three ARM Template ( ARM Template & zip file containing code & dependencies)
*  Data Streams ( provisions event-hub, serverless functions, cosmos DB)
*  WebApp Backend ( provisions service-bus, serverless functions, cosmos DB)
*  Serverless Functions ( provisions collection of HERE API functions.)

3) 7 individual serverless functions
* These 7 serverless functions are available on serverless library.

Once build is finished, you will find code zip files which are required for deployment under dist/deployable directory
refer these directories as below
* `azureMarketplacePublishing` : HERE uses this for publishing on marketplace
* `azureMarketplace`   : same as above and can be used by user as part of ARM template based deployment.
* `serverlesslibrary` : zip for 7 individual serverless functions.



### Step 5 : Deploy
Deployment can be done using locally available template or publicly accessible template links.

Code zip files which are created using build script need to be available on publicly accessible URL
Any hosting platform including Google-drive, Onedrive, etc. can be used.
You may wish to go for Azure Blob storage as well.
refer [Azure Blob Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction) for more details.

### Step 6: Deploy

Deployment can be done in various different ways for ARM Templates
* [Deploy Portal](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-template-deploy-portal)
* [Deploy CLI](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-template-deploy-cli)
* [Deploy Powershell](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-template-deploy)


### Function Access Key / Authorizaiton
Azure functions have different level of access and this project uses access-level as functions.   
This result in a different access key provisioned for each function, however a host-key can be used as well as single key to access all function deployed under same function-app.

You can find these keys under "Manage" section of provisioned function on portal.
for more details, refer : [Azure Function HTTP Trigger & Bindings](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook)

all below examples omitting inclusion of keys, you can add an extra parameter as `&code=<function/host-key>` as part of the URL or add an http header `x-functions-key` as part of the request.



## HERE Maps APIs with Function Proxies
The below list of HERE Maps APIs each has one Function as a proxy.



### Fleet Telematics
An example of an HTTP GET request to HERE.com:

`https://fleet.api.here.com/2/findsequence.json?departure=2018-12-20T16:52:00Z&destination1=40.7589836120605%2C-73.9747695922852;st:900;acc:mo09:30:00Z|fr12:00:00Z&destination2=40.5741%2C-74.3309;st:900;at:2018-12-25T16:00:00Z&mode=shortest;car&start=39.9558%2C-75.1820&end=40.0832%2C-74.0682&app_id=<appID>&app_code=<appCode>`

To call the Function proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent Azure Function Proxy:

`https://<fnAppName>.azurewebsites.net/api/fleet/2/findsequence.json?departure=2018-12-20T16:52:00Z&destination1=40.7589836120605%2C-73.9747695922852;st:900;acc:mo09:30:00Z|fr12:00:00Z&destination2=40.5741%2C-74.3309;st:900;at:2018-12-25T16:00:00Z&mode=shortest;car&start=39.9558%2C-75.1820&end=40.0832%2C-74.0682`

### Geocode

An example of an HTTP GET request to HERE.com:

`https://geocoder.api.here.com/6.2/geocode.json?searchtext=425+W+Randolph+Chicago&<appID>&app_code=<appCode>`

To call the Function proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent Azure Function Proxy:

`https://<fnAppName>.azurewebsites.net/api/geocoder/6.2/geocode.json?searchtext=425+W+Randolph+Chicago`


### Map Image

An example of an HTTP GET request to HERE.com:
`https://image.maps.api.here.com/mia/1.6/mapview?c=60.17675,24.929974&nodot&t=0&z=15&app_id=<appID>&app_code=<appCode>`

To call the Function proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent Azure Function Proxy:

`https://<fnAppName>.azurewebsites.net/api/map_image/mia/1.6/mapview?c=60.17675,24.929974&nodot&t=0&z=15`

### Map Tile

An example of an HTTP GET request to HERE.com:

`https://1.traffic.maps.api.here.com/maptile/2.1/traffictile/newest/normal.day/11/525/761/512/jpg?pview=ARG&app_id=<app_id&app_code=<app_code>`

To call the Function proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent Azure Function Proxy:

`https://<fnAppName>.azurewebsites.net/api/map_tile/traffic/maptile/2.1/traffictile/newest/normal.day/11/525/761/512/jpg?pview=ARG`

Azure Function proxy URL will depend on base URL type.
for example 
* https://1.traffic.maps.api.here.com/maptile/2.1/traffictile/newest

    Base URL : traffic

    function proxy URL : /api/map_tile/traffic/

* https://1.base.maps.api.here.com/maptile/2.1/streettile

    Base URL : base

    function proxy URL : /api/map_tile/base/


### Places

An example of an HTTP GET request to HERE.com:

`https://places.api.here.com/places/v1/autosuggest?q=NCL&in=19.6344,74.2931;r=131600;&size=3&app_id=<appID>&app_code=<appCode>`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<fnAppName>.azurewebsites.net/api/places/v1/autosuggest?q=NCL&in=19.6344,74.2931;r=131600;&size=3`

### Positioning

Note: this API call requires an HTTP **POST**.

An example of an HTTP POST to HERE.com:

`curl -i -X POST -H 'Content-Type: application/json' -d  '{ "gsm": [ {"mcc": 262,"mnc": 1,"lac": 5126,"cid": 16504,"nmr": [{"bsic": "6","bcch": "82"},{"bsic": "7","bcch": "85"},{"bsic": "12","bcch": "93"},{"bsic": "13","bcch": "88"},{"bsic": "19","bcch": "88"}]}]}' https://pos.api.here.com/positioning/v1/locate?&app_id=<app_id>&app_code=<app_code>`

An example of an HTTP POST to the equivalent AWS Lambda Proxy:

`curl -i -X POST -H 'Content-Type: application/json' -d  '{ "gsm": [ {"mcc": 262,"mnc": 1,"lac": 5126,"cid": 16504,"nmr": [{"bsic": "6","bcch": "82"},{"bsic": "7","bcch": "85"},{"bsic": "12","bcch": "93"},{"bsic": "13","bcch": "88"},{"bsic": "19","bcch": "88"}]}]}' https://<fnAppName>.azurewebsites.net/api/positioning/v1/locate`

### Routing

An example of an HTTP GET request to HERE.com:

`https://route.api.here.com/routing/7.2/calculateroute.xml?waypoint0=geo!52.5,13.4&waypoint1=geo!52.5,13.45&departure=now&mode=fastest;publicTransport&combineChange=true&app_id=<app_id>&app_code=<app_code>`

To call the Lambda proxy instead, replace the original URL with the API Gateway URL and change the Query String Parameters as follows:

An example of an HTTP GET request to the equivalent AWS Lambda Proxy:

`https://<fnAppName>.azurewebsites.net/api/routing/7.2/calculateroute.xml?waypoint0=geo!52.5,13.4&waypoint1=geo!52.5,13.45&departure=now&mode=fastest;publicTransport&combineChange=true`



## License

Copyright (c) 2017 HERE Europe B.V.

See the [LICENSE](./LICENSE) file in the root of this project for license details.
