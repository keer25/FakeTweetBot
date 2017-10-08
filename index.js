
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

//Game Initial Tweet images
tweets = [ {"url": "http://allindiaroundup.com/wp-content/uploads/2015/10/KRK-tweet-about-karan-johar.png", "fake":false},
            {"url": "https://scontent-bom1-1.xx.fbcdn.net/v/t34.0-12/22361337_1428552197264265_845718889_n.png?oh=dc8fbcbf1323a0aa2597743a66677cc0&oe=59DC5D95", "fake":true},
            {"url": "https://scontent-bom1-1.xx.fbcdn.net/v/t34.0-12/22323364_1428560393930112_120733817_n.png?oh=644be78b8a3693f37bbb98aeed79ba68&oe=59DC92C3", "fake":true },
            {"url": "https://scontent-bom1-1.xx.fbcdn.net/v/t34.0-12/22386531_1428551607264324_2098766147_n.png?oh=8c76736af742dea8a8d0db934fa749df&oe=59DCA7AC", "fake":false},
            {"url": "https://scontent.fmaa1-1.fna.fbcdn.net/v/t34.0-12/22407699_1428560893930062_1555253289_n.png?oh=6e9ce063e3fd3601297ee2a1b5046a51&oe=59DC33DA", "fake":false} ];

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
        var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
               // Typical action to be performed when the document is ready:
               bot.sendTextMessage(userId, attachment[0].payload.url);
            }
        };
        apiurl = "https://tameesh.in/bong/";
        xhr.open("POST", apiurl, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var params = {"url": attachment[0].payload.url};
        xhr.send(JSON.stringify(params));
		//Replace this with th call to the detector API and store attachment[0].payload.url
	}else {
		bot.sendTextMessage(userId, "Sorry! I am not trained to handle this");
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
        randint = Math.floor(Math.random() * 5);
    	url = tweets[randint].url;
    	isFake = tweets[randint].fake;
    	offset = 0;
    	if(!isFake) {
    		offset = 1;
    	}
    	var cb = function(err, result) {
    		var text = "Guess if the tweet is fake or not";
			var buttons = [
			    {
			        "type": "postback",
			        "title": "Fake",
			        "payload": payloadMessages[offset].payload
			    },
			    {
			        "type": "postback",
			        "title": "Not Fake",
			        "payload": payloadMessages[2 + offset].payload
			    }
			];
			bot.sendButtonMessage(userId, text, buttons);
    	}
    	bot.sendImageMessage(userId, url, cb);
    }else {
    	for (i = 0;i < 4; i++){
    		if(payload == payloadMessages[i].payload) {
    			bot.sendTextMessage(userId, payloadMessages[i].message);
    			text = "Play again?";
    			buttons = [ {"type": "postback", "title": "Yes!", "payload": "PLAY_GAME"},
    						{"type": "postback", "title": "Nah", "payload": "GET_STARTED"} ];
    			bot.sendButtonMessage(userId, text, buttons);
    		}
    	}
    }
});

function getStarted(userId){
    bot.sendTextMessage(userId, "Send a screenshot of a tweet and we will let you know if it is genuine or fake or Play a game to guess whether a tweet is fake or not!");
}

app.get("/", function (req, res){
res.send("hello world");
});

//Make Express listening
app.listen(process.env.PORT || 3000);