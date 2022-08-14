import { http, HttpHeader, HttpRequest, HttpRequestMethod } from "mojang-net";
import { world,EntityQueryOptions, BlockLocation, Location  } from 'mojang-minecraft';
import { variables   } from 'mojang-minecraft-server-admin';
const sign = require('jwt-encode');
var lastComandTime = Date.now();
var connected=false;
var connectTime=0;
var slowMode=false;
var commandQueue={};

var secret = variables.get("key");
var serverName = variables.get("severName");
var nickName = variables.get("nickName");
var owner = variables.get("owner");
var endpoint = "https://4sflrrfxa0.execute-api.us-east-2.amazonaws.com/default/bedrockSpawnsServerSetup"
var completedRedeems=[]

function parseModCommands(eventData){
	if (eventData.sender.hasTag("host")){
		if(eventData.message.includes("!help")){
			eventData.cancel = true;
			world.getDimension("overworld").runCommand("tell " +eventData.sender.name+" !connect: This command starts the connection to the Twitch Spawns Server. BDS will stay connected for 10 hours, until server restart or until disconnect is commanded" );
			world.getDimension("overworld").runCommand("tell " +eventData.sender.name+" !disconnect: If the BDS instance is connected, the connection is droped, this does not clear the que of commands" );
			world.getDimension("overworld").runCommand("tell " +eventData.sender.name+" !dump: Deletes all pending commands, this is not recoverable." );
			world.getDimension("overworld").runCommand("tell " +eventData.sender.name+" !slow: Caps the redeems per section to 1 per second. " );
			world.getDimension("overworld").runCommand("tell " +eventData.sender.name+" !normal: returns to running all redeems as soon as they are recieved" );
		}
		if (eventData.message.includes("!connect")){
			eventData.cancel = true;
			if(connected){
				world.getDimension("overworld").runCommand("tell " +eventData.sender.name+" timeout reset, 10 hours until disconnect" );
			}
			else{
				world.getDimension("overworld").runCommand("tell " +eventData.sender.name+" attempting connection" );
				connectTime=Date.now()
				connected=true;
			}
		}
		if (eventData.message.includes("!disconnect")){
			eventData.cancel = true;
			world.getDimension("overworld").runCommand("tell " +eventData.sender.name+" disconnected" );
			connected=false;
			
		}
		if (eventData.message.includes("!dump")){
			eventData.cancel = true;
			world.getDimension("overworld").runCommand("tell " +eventData.sender.name+" NOT IMPLMENTED" );
			
		}
		if (eventData.message.includes("!normal")){
			eventData.cancel = true;
			world.getDimension("overworld").runCommand("tell " +eventData.sender.name+" slow mode active" );
			slowMode=false;
		}
		if (eventData.message.includes("!slow")){
			eventData.cancel = true;
			world.getDimension("overworld").runCommand("tell " +eventData.sender.name+" slow mode active" );
			slowMode=true;
		}
	}
}

function getCommandsFromServer(){
	var payload={}
	payload["exp"]=Date.now()+60
	payload["serverName"]=serverName
	payload["completed"]=completedRedeems
	var token = "Bearer " + sign(payload, secret);
	console.log(completedRedeems)
	console.log(token)
	const request = new HttpRequest(endpoint);
	request.headers = [new HttpHeader("authorizationtoken", token)];
	request.method = HttpRequestMethod.GET;
	request.setTimeout(2)
	http.request(request).then(res => {
	const { body, headers, request, status } = res;
		var data=JSON.parse(body)
		console.log(JSON.stringify(data["redeems"]))
		var commandTimestamps=Object.keys(data["redeems"])
		commandTimestamps.sort()
		for (var i = 0; i<commandTimestamps.length; i++){
			var inqueue = Object.keys(commandQueue)
			//
			if(!(commandTimestamps[i] in commandQueue)){
				if(!(completedRedeems.includes(commandTimestamps[i]))){
					commandQueue[commandTimestamps[i]]=data["redeems"][commandTimestamps[i]]
				}
			}
			
		}
		completedRedeems = completedRedeems.filter( ( el ) => !data["completed"].includes( el ) );
		
	}).catch(err => {
	  console.error(err);
	});
}

function pollCommand(){	
	var numCommands=0
	if(Date.now()/1000>lastComandTime+36000*1000){
		connected=false;
	}
	getCommandsFromServer();
	var commandTimestamps=Object.keys(commandQueue)
	
	if(slowMode && commandTimestamps.length>1){
		numCommands=1;
	}
	else{
		numCommands=commandTimestamps.length
	}
	for (var i = 0; i<numCommands; i++){
		var commandTimeStamp=commandTimestamps[i]
		
		var redeem=commandQueue[commandTimeStamp]
		completedRedeems.push(commandTimeStamp)
		delete commandQueue[commandTimeStamp]
		for(var j=0;j<redeem.length;j++){
			var cmd=redeem[j]		
			world.getDimension("overworld").runCommand(cmd)
		}
	}
	
	
}



world.events.tick.subscribe(() => {
	if (Date.now()>lastComandTime+1000){
		lastComandTime=Date.now()
		if (connected){
			pollCommand();
		}
	}
});

world.events.beforeChat.subscribe((eventData) => {
	
	if (eventData.message.includes("!help")) {
		eventData.cancel = true;

		world.getDimension("overworld").runCommand("tell " +eventData.sender.name+" HELP: You have the permissions to run the following commands" );
	}
	parseModCommands(eventData)
	

});



/*
// simple http get url random get function
http.get("https://4sflrrfxa0.execute-api.us-east-2.amazonaws.com/default/bedrockSpawnsServerSetup").then(res => {
  // Do something with the response.
  const { body, headers, request, status } = res;

  console.warn(body);
  console.warn(headers);
  console.warn(request);
  console.warn(status);
}).catch(err => {
  console.error(err);
});

// simple http get url random request
const request = new HttpRequest("https://4sflrrfxa0.execute-api.us-east-2.amazonaws.com/default/bedrockSpawnsServerSetup");

request.uri = "https://4sflrrfxa0.execute-api.us-east-2.amazonaws.com/default/bedrockSpawnsServerSetup";
request.headers = [new HttpHeader("User-Agent", null)];
request.method = HttpRequestMethod.GET;

http.request(request).then(res => {
  // Do something with the response.
  const { body, headers, request, status } = res;

  console.warn(body);
  console.warn(headers);
  console.warn(request);
  console.warn(status);
}).catch(err => {
  console.error(err);
});

// cancel all http request with a reason
http.cancelAll("cancel all http request");
*/

