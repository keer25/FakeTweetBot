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

// Setup listener for incoming messages
bot.on('message', function(userId, message){
bot.sendTextMessage(userId, "I can't process that");
});

bot.on('attachment', function(userId, attachment){
	if(attachment[0].type == "image") {
		bot.sendImageMessage(userId, attachment[0].payload.url);
		//Replace this with th call to the detector API
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