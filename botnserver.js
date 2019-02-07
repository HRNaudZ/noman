const apikey = "72e27f5bf810febc87850ade6f075ffeb3afe593";
const express = require('express')
const app = express()
const rp = require('request-promise');
const $ = require('cheerio');
const urlg = require('url');
const fs = require("fs");

app.get('/udemy/*', function (req, res) {
    var url_parts = urlg.parse(req.url, true);

    if(url_parts.pathname=="/favicon.ico"){
        return;
    }

    res.setHeader('Content-Type', 'application/json');

    var search = url_parts.path.slice(7, url_parts.path.length);
  
    console.log("Someone searched (uhc server) : "+search+"\n\n");
    var REPD = []

    const url = 'https://1337x.to/search/udemy+'+search+'/1/';
    var cur_url = ''
    const links = []
    var datas = []
    var length

    rp(url)
    .then(function(html){
        for(let i = 0; i < $('tr > td > a', html).length; i++){
            if($('tr > td > a', html)[i].attribs.href.slice(0, 9)=='/torrent/'){
                cur_url = $('tr > td > a', html)[i].attribs.href;
                links.push(cur_url);
            }   
        }
        if(links.length==0){
            res.send([]);
            return;
        }
    })
    .catch(function(err){
        throw err
    }).finally(function(){
        length = links.length;
        links.forEach(function(url, index){
            let ndata = new Data(url.slice(17, url.length-1), '', '');
            rp('https://1337x.to'+url)
            .then(function(nhtml){
                var result = $('div > ul.download-links-dontblock > li > ul.dropdown-menu > li a', nhtml);
                for(let j=0; j < result.length; j++){
                    if(result[j].attribs.href.slice(0, 9)=="http://it"){
                        ndata.link1 = result[j].attribs.href;
                    }else if(result[j].attribs.href.slice(0, 6)=="magnet"){
                        ndata.link2 = result[j].attribs.href;
                    }
                }
                
            })
            .then(function(){ 
                ndata.shorten(REPD);
                datas.push(ndata);
            })
            .catch(function(err){
                throw err
            })
            .finally(function(){
                if(index==length-1){
                    setTimeout(()=>{
                        res.send(REPD);
                    }, 5000);
                }               
            })
        });
    })

})

app.listen(6969, function () {
console.log('==Udemy Hacked Course Provider Is Online On Port 6969 ==')
})

class Data{
    constructor(title, link1, link2){
        this.title = title;
        this.link1 = link1;
        this.link2 = link2;
    }

    shorten(REPD){
        let NRES = new Data(this.title, '', '');
        let l2 = this.link2;
        rp("https://clicksfly.com/api?api="+apikey+"&url="+this.link1+"&format=text")
            .then(function(linko){
                NRES.link1 = linko;
            })
            .catch(function(err){
                throw err;
            })
            .finally(function(){
                rp("https://clicksfly.com/api?api="+apikey+"&url="+l2+"&format=text")
                .then(function(linkt){
                    NRES.link2 = linkt;
                })
                .catch(function(err){
                    throw err;
                }).finally(function(){
                    REPD.push(NRES);
                })
            })
    }
}


const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '721579129:AAHBbnDSi8L48S26A0DPiqLXtbAOwVMylLM';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  var username = msg.from.first_name;

  var received_msg = msg.text.trim();

  if(received_msg=="/start"){
    newUser();
    console.log("Someone just registred\n\n");
    bot.sendMessage(chatId, '👋 Hi *'+username+'* !\nWelcome To *HackedUdemyBot* ! Here You Can Download All Paid udemy\
 Courses For Free !\n\n Just Type : */download keywords* To Get Download Links *(Torrent+Magnet)* !\n\n\
 For Example Type : */download web design*\n\
And You Will Get Links To Download (~20) Udemy Courses That Match The Keywords : *web*, *design* !\n\n\
 *Enjoy And Share With Your Friends 😎 !*', {
    'parse_mode' : 'markdown'
    });
  }
  else if(received_msg.substr(0, 10)=="/download " && received_msg.length>10 && isNaN(received_msg.substr(10))){
    
    newSearch();
    
    var search = received_msg.substr(10)

    rp('http://localhost:6969/udemy/'+search)
    .then(function(data){
        if(JSON.parse(data).length==0){
            bot.sendMessage(chatId, '😬 *Sorry No Results Found ! Try Using Other Keywords !*\n', {
                'parse_mode' : 'markdown'
                });
            return;
        }

        bot.sendMessage(chatId, '*💡 Results ('+JSON.parse(data).length+')*\n\n', {'parse_mode' : 'markdown'});

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

  }else if(received_msg=="loteur_non_lauteur"){
        bot.sendMessage(chatId, '😎 Juste Un Mec Du CIC', {
       'parse_mode' : 'markdown'
       });
  }
  else if(received_msg=="lestates_non_lesstats"){
    bot.sendMessage(chatId, getStats(), {
        'parse_mode' : 'markdown'
        });
  }
  else if(chatId>0) {
    bot.sendMessage(chatId, '😹 What do you mean ? ! Here You Can Download All Paid udemy\
 Courses For Free !\n\n Just Type : */download keywords* To Get Download Links *(Torrent+Magnet)* !\n\n\
    For Example Type : */download web design*\n\
And You Will Get Links To Download (~20) Udemy Courses That Match The Keywords : *web*, *design* !\n\n\
    *Enjoy And Share With Your Friends 😎 !*', {
       'parse_mode' : 'markdown'
       });
  }
  
});

function newUser(){
    var stats = JSON.parse(fs.readFileSync("./stats.json"));
    stats.users = stats.users+1;
    fs.writeFileSync("./stats.json", JSON.stringify(stats));
    console.log(stats);
}

function newSearch(){
    var stats = JSON.parse(fs.readFileSync("./stats.json"));
    console.log(stats);
    stats.searches = stats.searches+1;
    fs.writeFileSync("./stats.json", JSON.stringify(stats));
    console.log(stats);
}

function getStats(){
    var stats = JSON.parse(fs.readFileSync("./stats.json"));
    return "*Users* : "+stats.users+" & *Searches* : "+stats.searches;
}
