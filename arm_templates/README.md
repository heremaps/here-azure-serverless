# here_azure
Azure ARM template and functions for HERE Api

There are two examples    

1. http_fn_places  
This template creates a standard storage account and a function app.  
additionally it deploys a HTTP trigger function for "HERE places" API.  


2. servicebus_cosmosdb_fn_places  
This template creates "Servicebus", "cosmosDB", "function app"   
additionally it deploys a Servicebus trigger function which will received message from incoming queue  
once the function executes , it stores its output in cosmosDB instance.  


