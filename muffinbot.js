var Discord = require("discord.js");
var bot = new Discord.Client();

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// util methods
function Get(url) {
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.open("GET",url,false);
	Httpreq.send(null);
	return Httpreq.responseText;          
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

	if (!data.WotLK.online) {
		return "WotLK Server is currently offline!";
	}

	return "WotLK Server is online for " + data.WotLK.uptime.toString() + " seconds. Currently " + data.WotLK.players.toString() + " (" + data.WotLK.horde.toString() + " horde) players online.";

}

bot.on("message", msg => {

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


