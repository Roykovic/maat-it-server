var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;
var config = require('../config');
var jwt    = require('jsonwebtoken');

var mongoose = require('mongoose');
//mongoose.connect(config.mongooseUrl);
mongoose.connect('mongodb://admin:admin@ds121309.mlab.com:21309/maat-it');
Client = mongoose.model('Client');

function getHeartRate(req, res){
    Client.findById(req.params.id, function (err, client) {
        if (err || !client) return handleError(req, res, 500, err);
        return res.json(client.heartRate)
    })
}

function findAll(req, res){
    var query = {};
    if(req.query.attendantId) query.attendantId = req.query.attendantId;
    if(req.query.id) query._id = req.query.id;

  Client.find(query)
    .then(clients => {
      res.send(clients);
    }).catch(err => {
     res.status(500).send({
         message: err.message || "Some error occurred while retrieving clients."
     });
 });
}

function addHeartRate(req, res) {
    console.log(req.params.id);
    Client.findById(req.params.id, function (err, client) {
        if (err || !client) {
            console.log('Client not found, creating new one')
            var newClient = new Client({ heartRate: 'req.body.heartRate' });
            console.log('client created')
            console.log(req.body);
            client = newClient}
            client.heartRate = req.body.heartRate;
        client.save(function (err) {
            if (err) { return handleError(req, res, 500, err); console.log('error when saving')}
            else {
                var returnObj = {
                    msg:  "Heart rate saved successfully.",
                    id:    client.id,
                    heartRate:  client.heartRate
                };
                return res.json(returnObj);
            }
        });
    });
}

function addClient(req, res) {
    var name = req.body.name;
    var heartRate = req.body.heartRate;
    var client = new Client({ name: name , heartRate: heartRate});
    client.save(function (err, client) {
        if (err) return handleError(req, res, 500, err);
        return res.json(client)
    });
}

function assign(req, res){
    var clientID = req.body.clientId;
    var attendantID = req.body.attendantId;

    Client.findById(clientID, function (err, client) {
        if (err || !client) { return handleError(req, res, 404,err)}
        else{
                client.attendantId = attendantID;
                client.save(function (err) {
                    if (err) { return handleError(req, res, 500, err); console.log('error when saving')}
                    else{
                    var returnObj = {
                        msg:  "Client assigned succesfully",
                            id:    client.id,
                            ClientName: client.name,
                            AttendantID:  client.attendantId
                        };
                        res.json(returnObj);
                    }
                });
            }
        })
}

function authenticate(req, res) {
    Client.findById(req.body.id, function (err, client) {
        if (err || !client) {
           return handleError(req, res, 404, err);
            console.log('error when saving')
        }
        else {
            // test a matching password
            client.comparePassword(req.body.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    const payload = {
                        admin: client.name
                    };
                    var token = jwt.sign(payload, process.env.secretKey, {
                        expiresIn: 60 * 60 * 24 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        user_id: client._id,
                        token: token
                    });
                } else {
                   return handleError(req, res, 401, err);
                    console.log('Wrong password')
                }
            });
        }
    });
}

router.route('/auth')
    .post(authenticate);

router.use(function(req, res, next) {

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

router.route('/assign')
    .post(assign);

router.route('/:id')
    .post(addHeartRate)
    .get(getHeartRate);

router.route('/')
    .post(addClient)
    .get(findAll);

module.exports = function (errCallback){
    console.log('Initializing clients routing module');

    handleError = errCallback;
    return router;
};
