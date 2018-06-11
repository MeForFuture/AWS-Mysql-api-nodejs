var http = require('https');
var mysql = require('mysql');
var dateFormat = require('dateformat');
//var con = mysql.createConnection({
//    host: "node-js.ca4faffwkqbi.us-east-2.rds.amazonaws.com",
//    user: "root",
//    password: "123456789",
//    database: "node"
//});
//var coin_list = '';
//con.connect(function(err) {
//    if (err) throw err;
//    console.log("Connected!");
//
//    con.query('SELECT * FROM `coinlist`', function(err, results) {
//        if (err) throw err;
//        coin_list = JSON.parse(results);
//        console.log("coin list has been loaded");
//        con.end();
//    });
//});



var con = mysql.createConnection({
    host: "node-js.ca4faffwkqbi.us-east-2.rds.amazonaws.com",
    user: "root",
    password: "123456789",
    database: "node"
});
var remains = '';
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("select `last_date`, `coins` from `coins`", function (err, result) {
        if (err) throw err;
        remains = result;
        con.end();
    });
});



function OnResponse(response) {
    var data = ''; //This will store the page we're downloading.
    response.on('data', function(chunk) { //Executed whenever a chunk is received.
        data += chunk; //Append each chunk to the data variable.
    });

    response.on('end', function() {
        var coins = JSON.parse(data);
        var count = coins.length;

        var sql = "INSERT INTO `coins` (`last_date`, `coins`, `price`, `h24`, `l24`)  VALUES ";
        for(var i = 0;i < count; i++ )
        {
            var name = coins[i]["id"];
            var price = coins[i]["market_data"]["current_price"]["usd"];
            var high_24h = coins[i]["market_data"]["high_24h"]["usd"];
            var low_24h = coins[i]["market_data"]["low_24h"]["usd"];
            var last_date = coins[i]["last_updated"];
            if(last_date==null || last_date.length < 10)last_date=dateFormat(new Date(), "yyyy-mm-dd");
            var date = last_date.substring(0,10);
            var flag = true;
            for(var j = 0; j< remains.length;j++)
            {
                if(remains[j]['last_date']==date && remains[j]['coins']==name) {
                    flag = false;
                    console.log('skipped');
                    break;
                }
            }
            if(flag)sql+='(\''+ date + '\',\''+ name.replace('\'',' ') + '\',\'' + price
                + '\',\'' + high_24h+ '\',\'' + low_24h + '\'), ';

        }

        sql = sql.substring(0, sql.length - 2);
        console.log(sql);
        if(sql.length>72) {
            var con = mysql.createConnection({
                host: "node-js.ca4faffwkqbi.us-east-2.rds.amazonaws.com",
                user: "root",
                password: "123456789",
                database: "node"
            });
            con.connect(function (err) {
                if (err) throw err;
                console.log("Connected!");
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log(count + " record inserted");
                    con.end();
                });
            });
        }

    });
}
function  CallApi() {
    var interval = 5 * 1000;
    for (var i = 0; i < 8; i++) {

        setTimeout(function (i) {
            var urlData = {
                host: 'api.coingecko.com',
                path: '/api/v3/coins?order=gecko_desc&per_page=250&page=' + (i + 1),
                method: 'GET'
            }
            http.request(urlData, OnResponse).end();
        }, interval * i, i);
    }
}

var cron = require('node-cron');

cron.schedule('0 0 0 * * *', function(){
    setTimeout(CallApi,10000);
});
