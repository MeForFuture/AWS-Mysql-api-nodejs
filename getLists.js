
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
        var sql = "INSERT INTO `coinlist` (`sign`, `symbol`, `name`)  VALUES ";

            for(var i = 0;i < count; i++ )
            {

                var id = coins[i]["id"];
                var symbol = coins[i]["symbol"];
                var name = coins[i]["name"];
                sql+='(\'' + id.replace('\'',' ') + '\',\'' + symbol.replace('\'',' ')
                    + '\',\'' +  name.replace('\'',' ') + '\'), ';
            }


        sql = sql.substring(0, sql.length - 2);
        console.log(sql);
        var con = mysql.createConnection({
            host: "node-js.ca4faffwkqbi.us-east-2.rds.amazonaws.com",
            user: "root",
            password: "123456789",
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
//https://api.coingecko.com/api/v3/coins/list


var urlData = {
    host: 'api.coingecko.com',
    path: '/api/v3/coins/list',
    method: 'GET'
};
http.request(urlData, OnResponse).end();





