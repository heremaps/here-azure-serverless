### Azure MarketPlace solution template .

##  httpTriggerFunctions

Contains all 7 HERE API as http serverless functions.

## eventHubDataStreamBackend

Contains all 7 HERE API as datastream backend where incoming message is ingested on eventhub 
response for the same gets stored in provisioned COSMOS DB.

## serviceBusWebAppBackend

Contains all 7 HERE API as Webapp backend where incoming message is ingested on servicebus
response for the same gets stored in provisioned COSMOS DB.



To make these usable, a .zip file is required to be created, but before doing that deployables need to be prepared.
refer deployables/README.md in each folder for more details on creation of deployables .zip file

once that is done, prepare zip of these individual folders such that createUIDefinition.json and mainTemplate.json are at the root.


	cd httpTriggerFunctions
	zip -r ../httpTriggerFunctions.zip .


	cd eventHubDataStreamBackend
	zip -r ../eventHubDataStreamBackend.zip .


	cd serviceBusWebAppBackend
	zip -r ../serviceBusWebAppBackend.zip .



