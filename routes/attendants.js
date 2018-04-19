var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;

var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds121309.mlab.com:21309/maat-it');
Attendant = mongoose.model('Attendant');

function addAttendant(req, res) {
    var user = req.body.userName;
    var pass = req.body.pass;
    var attendant = new Attendant({ userName: user , password: pass});
    attendant.save(function (err, client) {
        if (err) handleError(req, res, 500, err);
        return res.json(client)
    });
}

function findAll(req, res){
    Attendant.find()
        .then(attendants => {
        res.send(attendants);
}).catch(err => {
        res.status(500).send({
        message: err.message || "Some error occurred while retrieving clients."
    });
});
}

router.route('/')
    .post(addAttendant)
    .get(findAll);