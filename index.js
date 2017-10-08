var config = require('./config');

var express = require('express');
var app = express();
var FBBotFramework = require('fb-bot-framework');
// Initialize
var bot = new FBBotFramework({
page_token: config.page_token,
verify_token: config.verify_token
});
// Setup Express middleware for /webhook
app.use("/webhook", bot.middleware());

var payloadMessages = [ { "payload": "GUESSED_FAKE_FAKE", "message": "Correct! You have quite an eye" },
						{ "payload": "GUESSED_FAKE_NOTFAKE", "message": "Ouch! It is actually a real tweet." },				
						{ "payload": "GUESSED_NOTFAKE_FAKE", "message": "You have been fooled. It is Fake. You are out user demographic" },
						{ "payload": "GUESSED_NOTFAKE_NOTFAKE", "message": "Yup it is not fake.. Clever!" }
					];

// Setup listener for incoming messages
bot.on('message', function(userId, message){
bot.sendTextMessage(userId, "I can't process that");
});

bot.on('attachment', function(userId, attachment){
	if(attachment[0].type == "image") {
		//Replace this with th call to the detector API and store attachment[0].payload.url
		bot.sendTextMessage(userId, "Analyser under construction");
	}else {
		bot.sendTextMessage(userId, "I can't process that");
	}
})

// Config the Get Started Button and register a callback
bot.setGetStartedButton("GET_STARTED");
var menuButtons = [
    {
        "type": "postback",
        "title": "Play Real or Fake",
        "payload": "PLAY_GAME"
    }
];
bot.setPersistentMenu(menuButtons);

bot.on('postback', function(userId, payload){
    if (payload == "GET_STARTED") {
        getStarted(userId);
    }else if (payload == 'PLAY_GAME') {
    	//Get a random image url from the API and whether it is fake or not
    	url = "https://scontent.fmaa1-1.fna.fbcdn.net/v/t34.0-0/p280x280/22360975_175571383007543_665586497_n.jpg?oh=369b2cda7ae6014c72a5846af6a0640b&oe=59DBFBF6";
    	isFake = true;
    	offset = 0;
    	if(!isFake) {
    		offset = 1;
    	}
    	bot.sendImageMessage(userId, url);
    	var text = "Guess if the tweet is fake or not";
		var buttons = [
		    {
		        "type": "postback",
		        "title": "Fake",
		        "payload": payloadMessages[offset].payload,
		        "fake": "no"
		    },
		    {
		        "type": "postback",
		        "title": "Not Fake",
		        "payload": payloadMessages[2 + offset].payload,
		        "fake": "no"
		    }
	];
		bot.sendButtonMessage(userId, text, buttons);
    }else {
    	for (i = 0;i < 4; i++){
    		if(payload == payloadMessages[i].payload) {
    			bot.sendTextMessage(userId, payloadMessages[i].message);
    		}
    	}
    }
});

function getStarted(userId){
    bot.sendTextMessage(userId, "Send a screenshot of a tweet and we will let you know if it is genuine or fake!");
}

app.get("/", function (req, res){
res.send("hello world");
});

//Make Express listening
app.listen(process.env.PORT || 3000);