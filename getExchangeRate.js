var http = require('https');
var mysql = require('mysql');

function OnResponse(response) {
    var data = ''; //This will store the page we're downloading.
    response.on('data', function (chunk) { //Executed whenever a chunk is received.
        data += chunk; //Append each chunk to the data variable.
    });

    response.on('end', function () {
        var sql = "INSERT INTO `exchangerate` (`allcoins`, `aud`, `brl`, `btc`," +
            "`cad`,`chf`,`cny`,`dkk`,`eth`,`eur`,`gbp`,`hkd`,`idr`,`inr`,`jpy`,`krw`, `mxn`,`myr`,`nzd`, `php`,`pln`,`rub`,`sek`,`sgd`,`twd`,`usd`,`xag`,`xau`," +
            "`xdr`,`zar`)  VALUES ";
        var exchange = JSON.parse(data);
        var rates = exchange.rates;
        var count = 1;
        var aud = rates["aud"]["value"];
        var brl = rates["brl"]["value"];
        var btc = 1;
        var cad = rates["cad"]["value"];
        var chf = rates["chf"]["value"];
        var cny = rates["cny"]["value"];
        var dkk = rates["dkk"]["value"];
        var eth = rates["eth"]["value"];
        var eur = rates["eur"]["value"];
        var gbp = rates["gbp"]["value"];
        var hkd = rates["hkd"]["value"];
        var idr = rates["idr"]["value"];
        var inr = rates["inr"]["value"];
        var jpy = rates["jpy"]["value"];
        var krw = rates["krw"]["value"];
        var mxn = rates["mxn"]["value"];
        var myr = rates["myr"]["value"];
        var nzd = rates["nzd"]["value"];
        var php = rates["php"]["value"];
        var pln = rates["pln"]["value"];
        var rub = rates["rub"]["value"];
        var sek = rates["sek"]["value"];
        var sgd = rates["sgd"]["value"];
        var twd = rates["twd"]["value"];
        var usd = rates["usd"]["value"];
        var xag = rates["xag"]["value"];
        var xau = rates["xau"]["value"];
        var xdr = rates["xdr"]["value"];
        var zar = rates["zar"]["value"];

        var values = {
            aud: aud,
            brl: brl,
            btc: btc,
            cad: cad,
            chf: chf,
            cny: cny,
            dkk: dkk,
            eth: eth,
            eur: eur,
            gbp: gbp,
            hkd: hkd,
            idr: idr,
            inr: inr,
            jpy: jpy,
            krw: krw,
            mxn: mxn,
            myr: myr,
            nzd: nzd,
            php: php,
            pln: pln,
            rub: rub,
            sek: sek,
            sgd: sgd,
            twd: twd,
            usd: usd,
            xag: xag,
            xau: xau,
            xdr: xdr,
            zar: zar
        };
//insert table data
//        for (var key in values) {
//
//            sql += '(\'' + key.toUpperCase() + '\',';
//            var main = values[key];
//
//            for (var key1 in values) {
//
//                sql += '\'' + values[key1] / main + '\',';
//
//            }
//            sql = sql.substring(0, sql.length - 1);
//            sql += '), ';
//            count++;
//        }
//        sql = sql.substring(0, sql.length - 2);
//        console.log(sql);
//        var con = mysql.createConnection({
//            host: "node-js.ca4faffwkqbi.us-east-2.rds.amazonaws.com",
//            user: "root",
//            password: "123456789",
//            database: "node"
//        });
//        con.connect(function (err) {
//            if (err) throw err;
//            console.log("Connected!");
//
//            con.query(sql, function (err, result) {
//                if (err) throw err;
//
//                console.log(count + " record inserted");
//                con.end();
//            });
//        });

//update table
        for (var key in values) {

            var main = values[key];
            var sql_update = " UPDATE `exchangerate` SET ";
            for (var key1 in values) {

                sql_update += '\`'+ key1 + '\`=' + '\'' + values[key1] / main + '\',';

            }
            sql_update = sql_update.substring(0, sql_update.length - 1);
            sql_update += ' WHERE `allcoins`=\'' + key.toUpperCase() + '\'';
            setTimeout(function () {

                console.log(sql_update);
                var con = mysql.createConnection({
                    host: "node-js.ca4faffwkqbi.us-east-2.rds.amazonaws.com",
                    user: "root",
                    password: "123456789",
                    database: "node"
                });


                con.connect(function (err) {
                    if (err) throw err;
                    console.log("Connected!");
                    con.query(sql_update, function (err, result) {
                        if (err) throw err;
                        console.log("One record updated");

                        con.end();
                    });
                });

            }, count*5000);
            count++;
        }



    });
}
function SQLexcution(sql_update) {
    console.log(sql_update);
    var con = mysql.createConnection({
        host: "node-js.ca4faffwkqbi.us-east-2.rds.amazonaws.com",
        user: "root",
        password: "123456789",
        database: "node"
    });

    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");

        con.query(sql_update, function (err, result) {
            if (err) throw err;
            console.log("One record inserted");
            con.end();
        });
    });
}

// call the rest of the code and have it execute after 3 seconds


var urlData = {
    host: 'api.coingecko.com',
    path: '/api/v3/exchange_rates',
    method: 'GET'
}
http.request(urlData, OnResponse).end();





