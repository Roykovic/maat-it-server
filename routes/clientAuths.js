var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;
var jwt    = require('jsonwebtoken');

var mongoose = require('mongoose');
//mongoose.connect(config.mongooseUrl);
mongoose.connect('mongodb://admin:admin@ds121309.mlab.com:21309/maat-it');
ClientAuth = mongoose.model('ClientAuth');

function createClientAuth(req, res) {
    var qr = req.body.qr;
    var clientAuth = new ClientAuth({ clientId: null , password: qr});
    clientAuth.save(function (err, client) {
        if (err) handleError(req, res, 500, err);
        return res.json(client)
    });
}

function find(req, res){
    ClientAuth.findById(req.params.id, function (err, clientAuth) {
        if (err) { handleError(req, res, 404, err); console.log('error with searching')}
        else {
            return res.json(clientAuth.clientId);
        }
    });
}

router.route('/')
    .post(createClientAuth);

router.route('/:id')
    .post(addClientId)
    .get(find);


module.exports = function (errCallback){
    console.log('Initializing clientAuths routing module');

    handleError = errCallback;
    return router;
}
