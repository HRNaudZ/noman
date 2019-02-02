const apikey = "d229be310fe17f56dcd75a01028504f57741d0d5";
const express = require('express')
const app = express()
const rp = require('request-promise');
const $ = require('cheerio');
const urlg = require('url');

app.get('/udemy/*', function (req, res) {
    var url_parts = urlg.parse(req.url, true);

    if(url_parts.pathname=="/favicon.ico"){
        return;
    }

    res.setHeader('Content-Type', 'application/json');

    var search = url_parts.path.slice(7, url_parts.path.length);
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
