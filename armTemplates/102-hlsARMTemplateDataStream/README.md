# Azure Serverless EventHub Trigger Function App.

Creates a single eventHub triggered function catering to 7 here location suite API.

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fheremaps%2Fhere-azure-serverless%2Fmaster%2FarmTemplates%2F102-hlsARMTemplateDataStream%2Fazuredeploy.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
</a>

This template does the following thing   
	1. Creates a eventhub namespace.  
	2. Creates a cosmos DB (SQL) instance.  
	3. Creates a standard storage account.  
	4. Creates a function app.  
	5. deploys event-hub triggered function  which caters to 7 HERE APIs.  

It is an unidirectional journey where request will be received on eventhub .   
Incoming message to eventhub triggers function which internally calls respective Here API.   
Result for this function call will be stored in Cosmos DB instance which is created as part of this template.   
   
Storage into CosmosDB will be in a database ID called "HERE_API_LOGS".

Client app / producer is expected to send requests on eventhub named "here_api_eventhub"
