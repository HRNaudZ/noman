const TelegramBot = require('node-telegram-bot-api');
const rp = require('request-promise');

// replace the value below with the Telegram token you receive from @BotFather
const token = '721579129:AAGvCML5-8LrdzcPkd-KpLiOyl7mFkA6UEg';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  var username = msg.from.first_name;

  var received_msg = msg.text.trim();

  if(received_msg=="/start"){
    bot.sendMessage(chatId, '👋 Hi *'+username+'* !\nWelcome To *HackedUdemyBot* ! Here You Can Download All Paid udemy\
 Courses For Free !\n\n Just Type : */download keywords* To Get Download Links *(Torrent+Magnet)* !\n\n\
 For Example Type : */download web design*\n\
And You Will Get Links To Download (~20) Udemy Courses That Match The Keywords : *web*, *design* !\n\n\
 *Enjoy And Share With Your Friends 😎 !*', {
    'parse_mode' : 'markdown'
    });
  }
  else if(received_msg.substr(0, 10)=="/download " && received_msg.length>10 && isNaN(received_msg.substr(10))){
    var search = received_msg.substr(10)

    rp('http://localhost:6969/udemy/'+search)
    .then(function(data){
        if(JSON.parse(data).length==0){
            bot.sendMessage(chatId, '😬 *Sorry No Results Found ! Try Using Other Keywords !*\nYour Keywords : *'+search+'*', {
                'parse_mode' : 'markdown'
                });
            return;
        }

        //bot.sendMessage(chatId, '*💡 Results ('+JSON.parse(data).length+')*\n\n', {'parse_mode' : 'markdown'});

        JSON.parse(data).forEach((element, index) => {
            bot.sendMessage(chatId, '\n\n*('+(index+1)+') 📕 Title : '+element.title+'*\n', {
                'parse_mode' : 'markdown'
                ,
                'reply_markup' : {
                    'inline_keyboard':[
                        [{text:"📥Torrent", url: element.link1}, {text:"🔰Magnet", url:element.link2}]
                    ]
                }});
        });
    }).catch(function(err){
        throw err;
    })



    bot.sendMessage(chatId, '😒 *Wait 5 Seconds ! ⏳ We Are Loading All Your Links Now !*\nYour Keywords : *'+search+'*', {
       'parse_mode' : 'markdown'
       });

  }else{
    bot.sendMessage(chatId, '😹 What do you mean ? ! Here You Can Download All Paid udemy\
 Courses For Free !\n\n Just Type : */download keywords* To Get Download Links *(Torrent+Magnet)* !\n\n\
    For Example Type : */download web design*\n\
And You Will Get Links To Download (~20) Udemy Courses That Match The Keywords : *web*, *design* !\n\n\
    *Enjoy And Share With Your Friends 😎 !*', {
       'parse_mode' : 'markdown'
       });
  }
  
});