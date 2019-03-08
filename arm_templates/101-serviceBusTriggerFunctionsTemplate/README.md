# Azure Serverless ServiceBus Queue Trigger Function App.

Create collection of service bus triggered functions

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fnavinmistry%2Fhere_azure%2Fmaster%2Farm_templates%2F101-serviceBusTriggerFunctionsTemplate%2Fazure_deploy.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
</a>


This template does the following thing   
	1. Creates a servicebus namespace.  
	2. Creates a cosmos DB (SQL) instance.  
	3. Creates a standard storage account.  
	4. Creates a function app.  
	5. deploys collection of 7 Servicebus Queue trigger function for HERE APIs.  

It is an unidirectional journey where request will be received on servicebus queue.   
Incoming message to service bus triggers function which internally calls respective Here API.   
Result for this function call will be stored in Cosmos DB instance which is created as part of this template.   
   
Storage into CosmosDB will be in a database ID called "HERE_API_LOGS" and different containers gets created for each API set.

