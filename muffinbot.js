
// The bot itself
var Discord = require("discord.js");
var bot = new Discord.Client();

// for http requests
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// for pinging servers
var ping = require('ping');
var online = true; // true if server online according to pings, don't change on json api calls!

// util methods
function Get(url) {
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.open("GET",url,false);
	Httpreq.send(null);
	return Httpreq.responseText;          
}

// pings server given by the ipv4 address, returns 0 on successful ping, else -1.
function pingServer(serverIP) {
	ping.sys.probe(serverIP, function(isAlive){
		console.log(isAlive);
		if (isAlive) {
			return 0;
		} else {
			return -1;
		}
    });
}

function checkPing() { // TODO ip
	var res = pingServer("94.23.160.232");
	if (res == 0) {
		// online, check if offline at last ping
		
		//if (!online) {
		//	var genChannel = bot.channels.get("name", "general");
		//	bot.sendMessage(genChannel, "Server seems to be offline!");
		//}
		online = true;
	} else {
		// offline, check if online at last ping
		//if (online) {
		//	var genChannel = bot.channels.get("name", "general");
		//	bot.sendMessage(genChannel, "Server seems to be back online!");			
		//}
		online = false;
	}
	
}

function getWotlkServerStats() {
	var jsonData;
	try {
		jsonData = Get("https://www.rising-gods.de/serverstats.json");
	} catch(err) {
		return "Failed to retrieve data, maybe RG Homepage-Server currently offline: " + err;
	}
	var data = JSON.parse(jsonData);
	console.log(data);

	if (!online) { // only check from ping call, is more recent
		return "WotLK Server is currently offline!";
	}

	return "WotLK Server is online for " + data.WotLK.uptime.toString() + " seconds. Currently " + data.WotLK.players.toString() + " (" + data.WotLK.horde.toString() + " horde) players online.";

}

bot.on("ready", () => {
	// Once the bot is ready, let us know by logging this message into the console
	console.log("Bot is connected!");
	setInterval(checkPing, 2000); // ping server every 2 seconds.
});

bot.on("message", (msg) => {

	var text = msg.content.toLowerCase();
	console.log(text);
	if (text.startsWith("<@230991792646914048> ")) {
		var content = msg.content.substr(22).trim();
		console.log(content);

		if (content === "help" ||content === "?") {
			msg.reply("I can greet you if you greet me.\nI can give you the rising gods server state by typing \"server info\".");
			return;
		}

		if (content === "hi" || content === "hallo" || content === "huhu" || content === "hallöchen" || content === "hello" || content === "greetings") {
			msg.reply("Heyho :smile:");
			return;
		}
		if (content === "serverinfo" || content === "server info" || content === "serverstats" || content === "server stats") {
			msg.reply(getWotlkServerStats());
			return;
		}
		msg.reply("Sorry, das hab ich nicht verstanden :no_mouth:");
		
	}

});

bot.login("MjMwOTkxNzkyNjQ2OTE0MDQ4.Cs53ag.kK0dOVdB3Yy_2wEjOGRGtpvoh3Y");


