var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;
var jwt    = require('jsonwebtoken');

var mongoose = require('mongoose');
//mongoose.connect(config.mongooseUrl);
mongoose.connect('mongodb://admin:admin@ds121309.mlab.com:21309/maat-it');
ClientAuth = mongoose.model('ClientAuth');
Client = mongoose.model('Client');

function createClientAuth(req, res) {
    var qr = req.body.qr;
    var clientAuth = new ClientAuth({ clientId: null , password: qr});
    clientAuth.save(function (err, client) {
        if (err) handleError(req, res, 500, err);
        return res.json(client)
    });
}

function addClientId(req, res){
    var isSet = false;
    ClientAuth.find({}, function(err, ca){
        var length = ca.length;
        ca.forEach(
            function(clientAuth){
                clientAuth.comparePassword(req.params.id, function (err, isMatch) {
                    if(isMatch){
                        isSet = true;
                        clientAuth.clientId = req.body.clientId;
                        clientAuth.save(function (err) {
                            if (err) { handleError(req, res, 500, err); console.log('error when saving')}
                        });
                    }
                    if(clientAuth == ca[length-1]) {
                        if (isSet) {
                            return res.json(isSet);
                        }
                        else {
                            handleError(req, res, 404, err);
                            console.log('Auth code not found')
                        }
                    }
                });
            }
        );
    });
}

function find(req, res){
    clientId = null;
    ClientAuth.find({}, function(err, ca){
        var length = ca.length;
        ca.forEach(
            function(clientAuth){
                clientAuth.comparePassword(req.params.id, function (err, isMatch) {
                    if(isMatch){
                        clientId = clientAuth.clientId;
                        Client.findById(clientId, function (err, client) {
                            if (client) {
                                client.password = req.params.id;
                                client.save(function (err, client) {
                                    if (err) handleError(req, res, 500, err);
                                });
                            }
                        });
                    }
                    if(clientAuth == ca[length-1]) {
                        if (clientId) {
                            return res.json(clientId);
                        }
                        else {
                            handleError(req, res, 404, err);
                            console.log('Auth code not found')
                        }
                    }
                });
            }
        );
    });
}

function getAll(req, res){
    ClientAuth.find()
        .then(clientAuths => {
        res.send(clientAuths);
}).catch(err => {
        res.status(500).send({
        message: err.message || "Some error occurred while retrieving clients."
    });
});
}

router.route('/')
    .get(getAll)
    .post(createClientAuth);

router.route('/:id')
    .post(addClientId)
    .get(find);


module.exports = function (errCallback){
    console.log('Initializing clientAuths routing module');

    handleError = errCallback;
    return router;
}