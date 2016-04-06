if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./node_modules/botkit/lib/Botkit.js');
var os = require('os');
var http = require('http');

var controller = Botkit.slackbot({
    debug: false
    // json_file_store: './storage'
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();


controller.hears(['ぬるぽ', 'ヌルポ'], 'ambient', function(bot, message) {
  bot.reply('message', 'ガッ！ …ところで、これってどういう意味？');
});

controller.hears(['進捗どうですか'], 'ambient', function(bot, message) {
  bot.api.users.info({
    user: message.user
  }, function(err, res) {
    if (err) {
      bot.botkit.log('Failed to load user info :(', err);
    } else {
      var userName = res.user.name;
      bot.reply('message', '逆にさぁー、 @' + userName + 'さんは進捗どう思うー？');
    }
  });
});

controller.hears(['かわいい'], 'direct_message,direct_mention,mention', function(bot, message) {
  var messages = ['でしょ？', ':zzz:', '……きらっ :star:', 'ぐ～…（寝たふりしてよう）', '知ってた :P', 'どやぁ :star:'];
  bot.reply(message, messages[Math.random() * messages.length | 0]);
});

controller.hears(['杏ちゃん', 'あんずちゃん'], 'ambient', function(bot, message) {

  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'candy'
  }, function(err, res) {
    if (err) {
      bot.botkit.log('Failed to add emoji reaction :(',err);
    }
  });

  bot.api.users.info({
    user: message.user
  }, function(err, res) {
    if (err) {
      bot.botkit.log('Failed to get user info :(',err);
    } else {
      bot.startConversation(message,function(err, convo) {
          convo.ask('@'+ res.user.name + ': なーに？飴くれるのー？',[
              {
                  pattern: ['はい', 'あげる'],
                  callback: function(response, convo) {
                      convo.say('ほんと？！ありがとー<3');
                      convo.next();
                  }
              },
              {
                  pattern: ['いいえ', 'あげない'],
                  default: true,
                  callback: function(response, convo) {
                      convo.say('えー、けち…(ふて寝しよっと)');
                      convo.next();
                  }
              }
          ]);
      });
    }
  });
});




// To keep Heroku's free dyno awake
http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Ok, dyno is awake.');
}).listen(process.env.PORT || 5000);
