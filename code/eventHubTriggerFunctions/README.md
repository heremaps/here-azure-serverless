# Azure EventHub Trigger Functions for HERE API
  This page contains 7 HERE API from "Here Location Suite" provided as Azure Serverless EventHubTrigger Functions

  1. Geocoder
  2. Routing
  3. Places
  4. Positioning
  5. Map Image
  6. Map Tiles
  7. Fleet Telematics

  Messages are arrived on Azure EventHub. On arrival of message a respective function gets triggered which invokes mapped API URL and stores it result in connected Cosmos DB. 
  
  Resource Provisioning for this setup is done using ARM template available under arm_templates directory in same repo.


## Deployment 

  Navigate to arm_templates/102-eventHubTriggerFunctionsTemplate
  Click on "Deploy to Azure" 
  
  This deployment will redirect to Microsoft Azure Portal and you'd need to enter credentials to proceed further.
  If you have not already registered for Azure Account, see this page. <Page-Link> 
  
  You will need HERE Credentials App_Id and App_code for this deployment, 
  If you have not already have that, Consider "Here Freemium plan" to begin with <Page-Link>
  

  Bundled code zip file is required for deployment, which is set as pre-configured value inside template.
  It points to latest release of eventHubTriggerFunctions.zip
  
  If you wish to change the code, see further section for details.
  
## Setup

### Pre-requisites 
  NodeJS ( LTS ), All Here Azure serverless functions have been created using NodeJS Version 8.11.1 ( LTS )

### Local setup.

  1. Clone this repo
       
    $ git clone <this repo>
    $ cd code/eventHubTriggerFunctions
  
  2. Install NPM packages.

    $ npm install

  3.  Install azure-functions-core-tools 
    
    $ npm install -g azure-functions-core-tools
     
  4. Verify if core-tools are available in PATH
      
    $  func --version 
      
      (you should see output similar as this )
      output : 2.4.xxx
 
  5. Install Azure-Event-Hub Extension
    
    $ func extensions install -p Microsoft.Azure.WebJobs.Extensions.EventHubs -v 3.0.0
    
  6. create Zip for deployment ( .zip extension file only supported )
    zip should contain all content of code/serviceBusTriggerFunctions directory , dont zip serviceBusTriggerFunctions itself.
    You can create zip from command-line/GUI as comfortable 
    Example : Mac Command-Line
    
    $ cd code/eventHubTriggerFunctions
    $ zip -r eventHubTriggerFunctions.zip *
    

  7. Make this .zip file available on public URL so it can be used as part of template deployment. ( refer : MSDeployUrl in template )


