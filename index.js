var express = require('express');
var app = express();
var bodyParser = require('body-parser');

require('./models/client');
require('./models/task');
require('./models/attendant');
require('./models/clientTask');

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

process.env.secretKey = "superrandom";

app.set('superSecret', process.env.secretKey);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/clients', require('./routes/clients')(handleError));
app.use('/attendants', require('./routes/attendants')(handleError));
app.use('/tasks', require('./routes/tasks')(handleError));
app.use('/client-tasks', require('./routes/clientTasks')(handleError));
