var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;
var config = require('../config');

var mongoose = require('mongoose');
//mongoose.connect(config.mongooseUrl);
mongoose.connect('mongodb://admin:admin@ds121309.mlab.com:21309/maat-it');
Client = mongoose.model('Client');

function getHeartRate(req, res){
    Client.findById(req.params.id, function (err, client) {
        if (err) handleError(req, res, 500, err);
        return res.json(client.heartRate)
    })
}

function findAll(req, res){
  Client.find()
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
            if (err) { handleError(req, res, 500, err); console.log('error when saving')}
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
    var client = new Client({ heartRate: '404' });
    console.log('before: ');
    console.log(client)
    client.save(function (err, client) {
        if (err) handleError(req, res, 500, err);
        return res.json(client)
    });
}

function assign(req, res){
    var clientID = req.body.clientId;
    var attendantID = req.body.attendantId;

    Client.findById(clientID, function (err, client) {
        if (err || !client) { handleError(req, res, 404,err)}
        else{
                client.attendantId = attendantID;
                client.save(function (err) {
                    if (err) { handleError(req, res, 500, err); console.log('error when saving')}
                    else {
                        var returnObj = {
                            msg:  "Client assigned succesfully",
                            id:    client.id,
                            AttendantID:  client.attendantId
                        };
                        res.json(returnObj);
                    }
                });
            };
        })
}


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
