var express = require('express');
var app = express();
require('./models/client');

app.get('/', function(req, res){
    res.send("You just performed a get on the maat-it server");
});

app.post('/', function(req, res){
    res.send("You just performed a post on the maat-it server");
});

app.listen(process.env.PORT || 3000);


function handleError(req, res, statusCode, message){
    console.log();
    console.log('-------- Error handled --------');
    console.log('Request Params: ' + JSON.stringify(req.params));
    console.log('Request Body: ' + JSON.stringify(req.body));
    console.log('Response sent: Statuscode ' + statusCode + ', Message "' + message + '"');
    console.log('-------- /Error handled --------');
    res.status(statusCode);
    res.json(message);
};

app.use('/clients', require('./routes/clients')(handleError));