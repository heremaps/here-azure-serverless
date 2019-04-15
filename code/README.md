#Source Code for Azure Serverless functions for  HERE APIs


### 1. httpTriggerFunctions :
	Contains HTTP Trigger functions for HERE API.
	Navigate inside for more details

### 2. serviceBusTriggerFunctions :
	Contains collection of HERE APIs as serviceBus Queue Trigger functions.
	Message arrives on service Bus Queue and a function processes respective Here API.		
	This is unidirectional journey and results are stored in CosmoDB.

	Navigate inside this directory for more details.

### 3. eventHubTriggerFunctions :
	Contains collection of HERE APIs as eventHub Trigger functions.
	Message arrives on eventHub and a function processes respective Here API.		
	This is unidirectional journey and results are stored in CosmoDB.

	Navigate inside this directory for more details.

	
