var http = require('https');

function OnResponse(response) {
    var data = ''; //This will store the page we're downloading.
    response.on('data', function (chunk) { //Executed whenever a chunk is received.
        data += chunk; //Append each chunk to the data variable.
    });

    response.on('end', function () {
        var coins = JSON.parse(data);
        console.log (coins);
    });
}

var urlData = {
    host: 'api.coingecko.com',
    path: '/api/v3/ping',
    method: 'GET'
}

//return ret;

var cron = require('node-cron');

cron.schedule('*/3 * * * * *', function(){
    http.request(urlData, OnResponse).end();
});