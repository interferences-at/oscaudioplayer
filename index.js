//--------------------------------------------------
//  Bi-Directional OSC messaging Websocket <-> UDP
//--------------------------------------------------
var osc = require("osc"),
    WebSocket = require("ws");

const path = require('path');
const fs = require('fs');
eval(fs.readFileSync('config.js')+'');

const directoryPath = path.join(__dirname, 'medias');

var Volumes = JSON.parse(fs.readFileSync("volumes.json"));

//Volumes.Volumes.forEach(function (volume)
//{
//    console.log("Volume " + volume); 
//});

var getIPAddresses = function () {
    var os = require("os"),
    interfaces = os.networkInterfaces(),
    ipAddresses = [];

    for (var deviceName in interfaces){
        var addresses = interfaces[deviceName];

        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];

            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

var writeVolumes = function() 
{
	var volumes = "var Volumes = [";

    Volumes.Volumes.forEach(function (volume)
    {
        volumes += volume + ",";
    });

    if(volumes.length > 0)
        volumes = volumes.slice(0, volumes.length - 1);

    volumes += "];";

    fs.writeFile('web/volumes.js', volumes, function (err)
    {
	  //if (err) throw err;
	  	//console.log('Volumes js written');
	});

	var volumesString = JSON.stringify(Volumes);

	fs.writeFile('volumes.json', volumesString, function (err)
    {
	  //if (err) throw err;
	  	//console.log('Volumes json written');
	});

};

fs.readdir(directoryPath, function (err, files)
{
    if (err)
    {
        return console.log('Unable to scan directory: ' + err);
    } 

    var fileList = "var PlayList = [";

    files.forEach(function (file)
    {
        //console.log(file); 
        fileList += "\"" + file + "\",";
    });

    fileList = fileList.slice(0, fileList.length - 1);

    fileList += "];";

    fs.writeFile('web/playlist.js', fileList, function (err)
    {
	  //if (err) throw err;
	  	//console.log('Playlist generated');
	});
});

var udp = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 7400,
    remoteAddress: "127.0.0.1",
    remotePort: 7500
});

udp.on("ready", function () {
    var ipAddresses = getIPAddresses();
    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", udp.options.localPort);
    });
    console.log("Broadcasting OSC over UDP to", udp.options.remoteAddress + ", Port:", udp.options.remotePort);
});

udp.on("message", function (oscMsg, timeTag, info) {
    udp.options.remoteAddress = info.address;
    //console.log("An OSC message just arrived!", oscMsg);
    //console.log("Remote info is: ", info);

    //Trap set volume to write it down
    var addressTokens = oscMsg.address.split('/');

    //addressTokens.forEach(function(token){
    //	console.log("Token " + token);
    //});


    if(addressTokens.length > 0)
    {
    	if(addressTokens[1] == PROJECT)
    	{
    		var track = parseInt(addressTokens[2]);

    		if(addressTokens.length == 3 && oscMsg.args.length > 0)
    		{
    			var paramNumber = parseFloat(oscMsg.args[0], 10);

				if(paramNumber != 0)
				{
					//TODO: Write volume file
					if(track >= Volumes.Volumes.length)
					{
						var missing = (track - Volumes.Volumes.length) + 1;
						for(var i = 0; i < missing; ++i)
						{
							Volumes.Volumes.push(1.0);
						}
					}

					Volumes.Volumes[track] = paramNumber;

					writeVolumes();


					//console.log("Changing track " + track + " volume to " + paramNumber);
				}
    		}
    	}
    }
});

udp.open();

var wss = new WebSocket.Server({
    port: 8081
});

wss.on("connection", function (socket) {
    console.log("A Web Socket connection has been established!");
    var socketPort = new osc.WebSocketPort({
        socket: socket
    });

    var relay = new osc.Relay(udp, socketPort, {
        raw: true
    });
});

//wss.on("message", function(data) {
//    console.log("Data received from webpage: ", data);
//});
