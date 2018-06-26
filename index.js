var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt    = require('jsonwebtoken');

require('./models/client');
require('./models/task');
require('./models/attendant');
require('./models/clientTask');
require('./models/clientAuth');

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

app.use('/attendants', require('./routes/attendants')(handleError));
app.use('/client-auths', require('./routes/clientAuths')(handleError));
app.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['authorization'];

    if(token != null && token.indexOf("Bearer") > -1) {
        token = token.split(" ")[1]
    }

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, process.env.secretKey, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});


app.use('/clients', require('./routes/clients')(handleError));
app.use('/tasks', require('./routes/tasks')(handleError));
app.use('/client-tasks', require('./routes/clientTasks')(handleError));
