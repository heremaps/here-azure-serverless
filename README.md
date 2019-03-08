#Azure HTTP Trigger Functions for HERE API
API availables as part of this are :

1. Geocoder
2. Routing
3. Places
4. Positioning
5. Map Image
6. Map Tiles
7. Fleet Telematics


#Setup

1. Checkout code .
2. Install NPM packages.

        $ npm install


3. create Zip for deployment 
  Make sure   
  a. Create .zip extension file only
  b. Dont zip single root folder itself , instead zip content of root folder by selecting all apis along with files.
  
 

        $ zip -r HttpTriggerFunctions.zip *


Make this zip available to template as part of deployment ( template section :MSDeployUrl)



