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