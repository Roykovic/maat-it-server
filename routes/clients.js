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
});

}

function addHeartRate(req, res) {
    req.params.id =  mongoose.Types.ObjectId(req.params.id);
    Client.findById(req.params.id, function (err, client) {
        if (err || !client) {
            var newClient = new Client({ heartRate: 'req.body.heartRate' });
            console.log(req.body);
            client = newClient}
            client.heartRate = req.body.heartRate;
        client.save(function (err) {
            if (err) { handleError(req, res, 500, err); }
            else {
                return res.json(client);
            }
        });
    });
}

function addClient(req, res) {
    var client = new Client({ heartRate: '404' });
    client
        .save()
        .then(savedClient => {
        res.status(201);
        res.json(savedClient);
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