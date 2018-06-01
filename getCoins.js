var http = require('https');
var mysql = require('mysql');

function OnResponse(response) {
    var data = ''; //This will store the page we're downloading.
    response.on('data', function(chunk) { //Executed whenever a chunk is received.
        data += chunk; //Append each chunk to the data variable.
    });

    response.on('end', function() {
        var coins = JSON.parse(data);
        var count = coins.length;
        var sql = "INSERT INTO `coins` (`coins`, `price`, `h24`, `mkt_cap`)  VALUES ";
        for(var i = 0;i < count; i++ )
        {
            var name = coins[i]["name"];
            var price = coins[i]["market_data"]["current_price"]["usd"];
            var eur = coins[i]["market_data"]["current_price"]["eur"];
            var eth = coins[i]["market_data"]["current_price"]["eth"];
            var gbp = coins[i]["market_data"]["current_price"]["gbp"];
            var jpy = coins[i]["market_data"]["current_price"]["jpy"];

            var h24 = coins[i]["market_data"]["price_change_percentage_24h"];
            var mkt_cap = coins[i]["market_data"]["market_cap"]["usd"];
            sql+='(\'' + name.replace('\'',' ') + '\',\'' + price
                + '\',\'' + h24+ '\',\'' + mkt_cap + '\'), ';
        }

        sql = sql.substring(0, sql.length - 2);
        console.log(sql);
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "node"
        });
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");

            con.query(sql, function (err, result) {
                if (err) throw err;

                console.log(count +" record inserted");
                con.end();
            });
        });

    });
}
var interval = 10 * 1000;
for(var i = 0; i< 8; i++)
{
    setTimeout( function (i) {
        var urlData = {
            host: 'api.coingecko.com',
            path: '/api/v3/coins?order=gecko_desc&per_page=250&page=' +(i+1),
            method: 'GET'
        }
        http.request(urlData, OnResponse).end();
    }, interval * i, i);
}



