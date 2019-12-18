#!/bin/sh

# Build script for azure HLS work.
azureHLSWorkspaceDir="`pwd`"
zipCommandPrefix=" zip -rq  "
zipCommandSuffix='  -x "**/.DS_Store"  -x "*/.DS_Store" -x ".DS_Store" -x "*.DS_Store"'
echo "WS Dir : [$azureHLSWorkspaceDir]"

# Check if "npm" is installed 
if ! [ -x "$(which npm)" ]
then
    echo "Make sure 'node' & 'npm' are in PATH, install if doesnt exist on system."
    exit 1
fi

# Check if nodeJS version is >= 8.11
if ! [ -x "$(which node)" ]
then
    echo "Azure HLS APIs are compiled with node LTS version 10.14.1"
    exit 1
fi
# Check if azure-function-core-tools are installed.
if ! [ -x "$(which func)" ]
then
    echo "Azure function core tools not installed."
    echo "Run below command to fix this"
    echo "npm install  -g azure-functions-core-tools"
exit 1
fi

# Move previous dist to a different directory.
cd $azureHLSWorkspaceDir
if [ -d "dist_previous" ] 
then
    echo "dist_previous directory found, removing it"
    rm -fr  dist_previous
fi
cd $azureHLSWorkspaceDir
if [ -d "dist" ] 
then
    echo "dist directory found, moving to dist_previous."
    mv dist dist_previous
fi

if [ -d "functionZips_previous" ] 
then
    echo "functionZips_previous directory found, removing it"
    rm -fr  functionZips_previous
fi
cd $azureHLSWorkspaceDir
if [ -d "functionZips" ] 
then
    echo "functionZips directory found, moving to functionZips_previous."
    mv functionZips functionZips_previous
fi

if [ -d "marketPlaceZips_previous   " ] 
then
    echo "marketPlaceZips_previous directory found, removing it"
    rm -fr  marketPlaceZips_previous
fi
cd $azureHLSWorkspaceDir
if [ -d "marketPlaceZips" ] 
then
    echo "marketPlaceZips directory found, moving to marketPlaceZips_previous."
    mv marketPlaceZips marketPlaceZips_previous
fi

# Create a new directory structure for Build 
echo "Creating new dist & Zip directory."
mkdir dist
mkdir functionZips
mkdir marketPlaceZips

# Create directories for Marketplace templates.
# Below directories will contain compiled code Zip file
mkdir -p dist/azureMarketplace/hlsTemplateDataStream
mkdir -p dist/azureMarketplace/hlsTemplateServerlessFunction
mkdir -p dist/azureMarketplace/hlsTemplateWebAppBackend

# Create directories for MarketPlace solutionTemplates based publishing zips.
# Below directories will contain publishing zip files.
mkdir -p dist/azureMarketplacePublishing/hlsSolutionTemplateDataStream
mkdir -p dist/azureMarketplacePublishing/hlsSolutionTemplateServerlessFunction
mkdir -p dist/azureMarketplacePublishing/hlsSolutionTemplateWebAppBackend

# Create directories for individual 7 HLS API Functions for serverlesslibrary.
mkdir -p dist/azureServerless/hlsAPIFleetTelematics
mkdir -p dist/azureServerless/hlsAPIGeocoder
mkdir -p dist/azureServerless/hlsAPIMapImage
mkdir -p dist/azureServerless/hlsAPIMapTile
mkdir -p dist/azureServerless/hlsAPIPlaces
mkdir -p dist/azureServerless/hlsAPIPositioning
mkdir -p dist/azureServerless/hlsAPIRouting


# Create deployable folder which is going to contain different zips.
mkdir -p dist/deployables/azureMarketplace
mkdir -p dist/deployables/azureMarketplacePublishing
mkdir -p dist/deployables/serverlesslibrary

# Copy LICENSE file in root of every deployable directory
cp $azureHLSWorkspaceDir/LICENSE $azureHLSWorkspaceDir/dist/azureMarketplace/hlsTemplateDataStream
cp $azureHLSWorkspaceDir/LICENSE $azureHLSWorkspaceDir/dist/azureMarketplace/hlsTemplateServerlessFunction
cp $azureHLSWorkspaceDir/LICENSE $azureHLSWorkspaceDir/dist/azureMarketplace/hlsTemplateWebAppBackend

cp $azureHLSWorkspaceDir/LICENSE $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIFleetTelematics
cp $azureHLSWorkspaceDir/LICENSE $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIGeocoder
cp $azureHLSWorkspaceDir/LICENSE $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIMapImage
cp $azureHLSWorkspaceDir/LICENSE $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIMapTile
cp $azureHLSWorkspaceDir/LICENSE $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIPlaces
cp $azureHLSWorkspaceDir/LICENSE $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIPositioning
cp $azureHLSWorkspaceDir/LICENSE $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIRouting

# Copy code from respective places to newly create directories

# 1.1 Building ARM Template "DataStreams"
echo "------------------------------------------------------"
echo "1.1 Building ARM Template deployables for 'DataStreams'"
echo "------------------------------------------------------"
    # a. Copy content & here library
    echo "\ta. Copying code content."
    # echo "\t------------------------------"
    cp -R $azureHLSWorkspaceDir/code/hlsTemplateDataStream/* $azureHLSWorkspaceDir/dist/azureMarketplace/hlsTemplateDataStream
    cp -R $azureHLSWorkspaceDir/code/hereLibs   $azureHLSWorkspaceDir/dist/azureMarketplace/hlsTemplateDataStream

    # b. installing dependencies.
    echo "\tb. Installing npm dependencies."
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureMarketplace/hlsTemplateDataStream && npm install > /dev/null 
    rm node_modules/to-arraybuffer/.npmignore
    rm node_modules/binary-search-bounds/.npmignore

    # c. install eventhub azure extension.
    echo "\tc. Installing Azure EventHubs extension"
    # echo "\t------------------------------"
    func extensions install -p Microsoft.Azure.WebJobs.Extensions.EventHubs -v 4.0.0 --javascript > /dev/null
    if [ $? -ne 0 ] 
    then
        echo "ERROR : Microsoft.Azure.WebJobs.Extensions.EventHubs extension not installed."
    fi

    # Create zip file.
    echo "\td. Creating Zip file "
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureMarketplace/hlsTemplateDataStream && 
    $zipCommandPrefix $azureHLSWorkspaceDir/dist/deployables/azureMarketplace/hlsTemplateDataStream.zip . $zipCommandSuffix

# 1.2. Building ARM Template "WebAppBackend"
echo "------------------------------------------------------"
echo "1.2. Building ARM Template deployables for 'WebApp Backend'"
echo "------------------------------------------------------"
    # a. Copy content & here library
    echo "\ta. Copying code content."
    # echo "\t------------------------------"
    cp -R $azureHLSWorkspaceDir/code/hlsTemplateWebAppBackend/* $azureHLSWorkspaceDir/dist/azureMarketplace/hlsTemplateWebAppBackend
    cp -R $azureHLSWorkspaceDir/code/hereLibs $azureHLSWorkspaceDir/dist/azureMarketplace/hlsTemplateWebAppBackend

    # b. Installing dependencies.
    echo "\tb. Installing npm dependencies."
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureMarketplace/hlsTemplateWebAppBackend && npm install > /dev/null 
    rm node_modules/to-arraybuffer/.npmignore
    rm node_modules/binary-search-bounds/.npmignore

    # c. install ServiceBus azure extension.
    echo "\tc. Installing Azure ServiceBus extension"
    # echo "\t------------------------------"
    func extensions install -p Microsoft.Azure.WebJobs.Extensions.ServiceBus -v 4.0.0 --javascript  > /dev/null

    if [ $? -ne 0 ] 
    then
        echo "ERROR : Microsoft.Azure.WebJobs.Extensions.ServiceBus extension not installed."
    fi

     # Create zip file.
    echo "\td. Creating Zip file "
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureMarketplace/hlsTemplateWebAppBackend && 
    $zipCommandPrefix $azureHLSWorkspaceDir/dist/deployables/azureMarketplace/hlsTemplateWebAppBackend.zip . $zipCommandSuffix

# 1.3 Building ARM Template "ServerlessFunctions"
echo "------------------------------------------------------"
echo "1.3. Building ARM Template deployables for 'ServerlessFunctions'"
echo "------------------------------------------------------"
   # a. Copy content & here library
    echo "\ta. Copying code content."
    # echo "\t------------------------------"
    cp -R $azureHLSWorkspaceDir/code/hlsTemplateServerlessFunction/* $azureHLSWorkspaceDir/dist/azureMarketplace/hlsTemplateServerlessFunction
    cp -R $azureHLSWorkspaceDir/code/hereLibs $azureHLSWorkspaceDir/dist/azureMarketplace/hlsTemplateServerlessFunction

    # b. Installing dependencies.
    echo "\tb. Installing npm dependencies."
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureMarketplace/hlsTemplateServerlessFunction && npm install > /dev/null 

    # Create zip file.
    echo "\tc. Creating Zip file "
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureMarketplace/hlsTemplateServerlessFunction && 
    $zipCommandPrefix $azureHLSWorkspaceDir/dist/deployables/azureMarketplace/hlsTemplateServerlessFunction.zip . $zipCommandSuffix

# Build serverless library related serveless function ( one function for one HLS api.)

# 2.1 Building FleetTelematics API.
echo "------------------------------------------------------"
echo "2.1. Building ServerlessLibary Offering : 'FleetTelematics' function"
echo "------------------------------------------------------"
    # a. Copy content
    echo "\ta. Copying code content."
    # echo "\t------------------------------"
    cp -R $azureHLSWorkspaceDir/code/hlsAPIFleetTelematics/* $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIFleetTelematics
    cp -R $azureHLSWorkspaceDir/code/hereLibs $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIFleetTelematics

    # b. Installing dependencies.
    echo "\tb. Installing npm dependencies."
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIFleetTelematics && npm install > /dev/null 

     # Create zip file.
    echo "\tc. Creating Zip file "
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIFleetTelematics && 
    $zipCommandPrefix $azureHLSWorkspaceDir/dist/deployables/serverlesslibrary/hlsAPIFleetTelematics.zip . $zipCommandSuffix

# 2.2 Building Geocoder API.
echo "------------------------------------------------------"
echo "2.2 Building ServerlessLibary Offering : 'Geocoder' function"
echo "------------------------------------------------------"
    # a. Copy content
    echo "\ta. Copying code content."
    # echo "\t------------------------------"
    cp -R $azureHLSWorkspaceDir/code/hlsAPIGeocoder/* $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIGeocoder
    cp -R $azureHLSWorkspaceDir/code/hereLibs $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIGeocoder


    # b. installing dependencies.
    echo "\tb. Installing npm dependencies."
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIGeocoder && npm install > /dev/null 

    # Create zip file.
    echo "\tc. Creating Zip file "
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIGeocoder && 
    $zipCommandPrefix $azureHLSWorkspaceDir/dist/deployables/serverlesslibrary/hlsAPIGeocoder.zip . $zipCommandSuffix

# 2.3 Building MapImage API.
echo "------------------------------------------------------"
echo "2.3 Building ServerlessLibary Offering : 'MapImage' function"
echo "------------------------------------------------------"
    # a. Copy content
    echo "\ta. Copying code content."
    # echo "\t------------------------------"
    cp -R $azureHLSWorkspaceDir/code/hlsAPIMapImage/* $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIMapImage
    cp -R $azureHLSWorkspaceDir/code/hereLibs $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIMapImage

    # b. Installing dependencies.
    echo "\tb. Installing npm dependencies."
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIMapImage && npm install > /dev/null 

    # Create zip file.
    echo "\tc. Creating Zip file "
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIMapImage && 
    $zipCommandPrefix $azureHLSWorkspaceDir/dist/deployables/serverlesslibrary/hlsAPIMapImage.zip . $zipCommandSuffix

# 2.4 Building MapImage API.
echo "------------------------------------------------------"
echo "2.4 Building ServerlessLibary Offering : 'MapTile' function"
echo "------------------------------------------------------"
    # a. Copy content
    echo "\ta. Copying code content."
    # echo "\t------------------------------"
    cp -R $azureHLSWorkspaceDir/code/hlsAPIMapTile/* $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIMapTile
    cp -R $azureHLSWorkspaceDir/code/hereLibs $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIMapTile

    # b. Installing dependencies.
    echo "\tb. Installing npm dependencies."
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIMapTile && npm install > /dev/null 

    # Create zip file.
    echo "\tc. Creating Zip file "
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIMapTile && 
    $zipCommandPrefix $azureHLSWorkspaceDir/dist/deployables/serverlesslibrary/hlsAPIMapTile.zip . $zipCommandSuffix

# 2.5 Building Places API.
echo "------------------------------------------------------"
echo "2.5 Building ServerlessLibary Offering : 'Places' function"
echo "------------------------------------------------------"
    # a. Copy content
    echo "\ta. Copying code content."
    # echo "\t------------------------------"
    cp -R $azureHLSWorkspaceDir/code/hlsAPIPlaces/* $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIPlaces
    cp -R $azureHLSWorkspaceDir/code/hereLibs $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIPlaces

    # b. Installing dependencies.
    echo "\tb. Installing npm dependencies."
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIPlaces && npm install > /dev/null 

    # Create zip file.
    echo "\tc. Creating Zip file "
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIPlaces && 
    $zipCommandPrefix $azureHLSWorkspaceDir/dist/deployables/serverlesslibrary/hlsAPIPlaces.zip . $zipCommandSuffix

# 2.6 Building Positioning API.
echo "------------------------------------------------------"
echo "2.6 Building ServerlessLibary Offering : 'Positioning' function"
echo "------------------------------------------------------"
    # a. Copy content
    echo "\ta. Copying code content."
    # echo "\t------------------------------"
    cp -R $azureHLSWorkspaceDir/code/hlsAPIPositioning/* $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIPositioning
    cp -R $azureHLSWorkspaceDir/code/hereLibs $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIPositioning

     # b. Installing dependencies.
    echo "\tb. Installing npm dependencies."
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIPositioning && npm install > /dev/null 

   # Create zip file.
    echo "\tc. Creating Zip file "
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIPositioning && 
    $zipCommandPrefix $azureHLSWorkspaceDir/dist/deployables/serverlesslibrary/hlsAPIPositioning.zip . $zipCommandSuffix

# 2.7 Building Routing API.
echo "------------------------------------------------------"
echo "2.7 Building ServerlessLibary Offering : 'Routing' function"
echo "------------------------------------------------------"
    # a. Copy content
    echo "\ta. Copying code content."
    # echo "\t------------------------------"
    cp -R $azureHLSWorkspaceDir/code/hlsAPIRouting/* $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIRouting
    cp -R $azureHLSWorkspaceDir/code/hereLibs $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIRouting

     # b. Installing dependencies.
    echo "\tb. Installing npm dependencies."
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIRouting && npm install > /dev/null 

     # Create Zip file.
    echo "\tc. Creating Zip file "
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureServerless/hlsAPIRouting && 
    $zipCommandPrefix $azureHLSWorkspaceDir/dist/deployables/serverlesslibrary/hlsAPIRouting.zip . $zipCommandSuffix



# Create Marketplace publishing offer zips.

# 3.1. Building Solution Template for DataStream API.
echo "------------------------------------------------------"
echo "3.1 Building MarketPlace Offer: 'DataStreams' "
echo "------------------------------------------------------"
    # a. Copy content
    echo "\ta. Copying UI Definition & Template"
    # echo "\t------------------------------"
    cp -R $azureHLSWorkspaceDir/solutionTemplates/hlsSolutionTemplateDataStream/* $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateDataStream

    # b. Copy Nested ARM Template files
    echo "\tb. Copying nested ARM Template."
    # echo "\t------------------------------"
    mkdir -p $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateDataStream/nestedtemplates
    cp $azureHLSWorkspaceDir/armTemplates/102-hlsARMTemplateDataStream/azuredeploy.json $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateDataStream/nestedtemplates

    # c. Copy Serverless function & code zip.
    echo "\tc. Copying deployables"
    # echo "\t------------------------------"
    mkdir -p $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateDataStream/deployables
    cp $azureHLSWorkspaceDir/dist/deployables/azureMarketplace/hlsTemplateDataStream.zip $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateDataStream/deployables

    # Create Zip file.
    echo "\td. Creating Zip file "
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateDataStream && 
    $zipCommandPrefix $azureHLSWorkspaceDir/dist/deployables/azureMarketplacePublishing/hlsSolutionTemplateDataStream.zip . $zipCommandSuffix

# 3.2. Building Solution Template for WebAppBackend API.
echo "------------------------------------------------------"
echo "3.2 Building MarketPlace Offer: 'WebAppBackend' "
echo "------------------------------------------------------"
   # a. Copy content
    echo "\ta. Copying UI Definition & Template"
    # echo "\t------------------------------"
    cp -R $azureHLSWorkspaceDir/solutionTemplates/hlsSolutionTemplateWebAppBackend/* $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateWebAppBackend
    

    # b. Copy Nested ARM Template files
    echo "\tb. Copying nested ARM Template."
    # echo "\t------------------------------"
    mkdir -p $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateWebAppBackend/nestedtemplates
    cp $azureHLSWorkspaceDir/armTemplates/101-hlsARMTemplateWebAppBackend/azuredeploy.json $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateWebAppBackend/nestedtemplates

    # c. Copy Serverless function & code zip.
    echo "\tc. Copying deployables"
    # echo "\t------------------------------"
    mkdir -p $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateWebAppBackend/deployables
    cp $azureHLSWorkspaceDir/dist/deployables/azureMarketplace/hlsTemplateWebAppBackend.zip $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateWebAppBackend/deployables

    # Create Zip file.
    echo "\td. Creating Zip file "
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateWebAppBackend && 
    $zipCommandPrefix $azureHLSWorkspaceDir/dist/deployables/azureMarketplacePublishing/hlsSolutionTemplateWebAppBackend.zip . $zipCommandSuffix

# 3.3 Building Solution Template for WebAppBackend API.
echo "------------------------------------------------------"
echo "3.3 Building MarketPlace Offer: 'Serverless Functions' "
echo "------------------------------------------------------"
   # a. Copy content
    echo "\ta. Copying UI Definition & Template"
    # echo "\t------------------------------"
    cp -R $azureHLSWorkspaceDir/solutionTemplates/hlsSolutionTemplateServerlessFunction/* $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateServerlessFunction

   # b. Copy Nested ARM Template files
    echo "\tb. Copying nested ARM Template."
    # echo "\t------------------------------"
    mkdir -p $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateServerlessFunction/nestedtemplates
    cp $azureHLSWorkspaceDir/armTemplates/100-hlsARMTemplateServerlessFunctions/azuredeploy.json $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateServerlessFunction/nestedtemplates

    # c. Copy Serverless function & code zip.
    echo "\tc. Copying deployables"
    # echo "\t------------------------------"
    mkdir -p $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateServerlessFunction/deployables
    cp $azureHLSWorkspaceDir/dist/deployables/azureMarketplace/hlsTemplateServerlessFunction.zip $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateServerlessFunction/deployables

    # Create Zip file.
    echo "\td. Creating Zip file "
    # echo "\t------------------------------"
    cd $azureHLSWorkspaceDir/dist/azureMarketplacePublishing/hlsSolutionTemplateServerlessFunction && 
    $zipCommandPrefix $azureHLSWorkspaceDir/dist/deployables/azureMarketplacePublishing/hlsSolutionTemplateServerlessFunction.zip . $zipCommandSuffix


# Sanity Check if all Zips are created.
echo "------------------------------------------------------"
echo "Below zips are created"
echo "------------------------------------------------------"
cd $azureHLSWorkspaceDir/dist/deployables
find . -name "*.zip"


# On MacOS, .DS_Store within zip reports error on marketplace publishing.
echo "------------------------------------------------------"
echo "Checking Zips containing .DS_Store file, no output expected "
echo "------------------------------------------------------"
find . -name "*.zip" -exec grep -l ".DS_Store" {} \;
echo "------------------------------------------------------"
echo "Updating functionZips Directory with latest zip files."
cp $azureHLSWorkspaceDir/dist/deployables/serverlesslibrary/*.zip $azureHLSWorkspaceDir/functionZips

echo "------------------------------------------------------"
echo "Updating marketPlaceZips Directory with latest zip files."
echo "------------------------------------------------------"
cp $azureHLSWorkspaceDir/dist/deployables/azureMarketplacePublishing/*.zip $azureHLSWorkspaceDir/marketPlaceZips
echo "------------------------------------------------------"
# EOF
