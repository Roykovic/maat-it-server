var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;

var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds121309.mlab.com:21309/maat-it');
Client = mongoose.model('Client');

function getHeartRate(req, res){
    Client.findById(req.params.id, function (err, client) {
        if (err) handleError(req, res, 500, err);
        return res.json(client.heartRate)
    })
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


router.route('/:id')
    .post(addHeartRate)
    .get(getHeartRate);

router.route('/')
    .post(addClient);

module.exports = function (errCallback){
    console.log('Initializing clients routing module');

    handleError = errCallback;
    return router;
};