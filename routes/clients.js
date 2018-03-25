var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;

var mongoose = require('mongoose');
Client = mongoose.model('Client');

function getHeartRate(req, res){
    var query = {};
    if(req.params.id){
        query._id = req.params.id;
    }

    var result = Client.find(query);

    result
        .then(data => {
        if(req.params.id){
        data = data[0];
    }
    return res.json(data);
})
.fail(err => handleError(req, res, 500, err));

}

function addHeartRate(req, res) {
    Client.findById(req.params.id, function (err, client) {
        if (err || !client) {
            var newClient = new Client({ heartRate: 'req.body.hearRat' });
            client = newClient}
            client.heartRate.push(req.body.heartRate);
        client.save(function (err) {
            if (err) { handleError(req, res, 500, err); }
            else {
                return res.json(client);
            }
        });
    });
}

function addClient(req, res) {
    var client = new Client(req.body);
    client
        .save()
        .then(savedClient => {
        res.status(201);
        res.json(savedClient);
        })
        .fail(err => handleError(req, res, 500, err));
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