var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;
var config = require('../config');

var mongoose = require('mongoose');
mongoose.connect(config.mongooseUrl);
Attendant = mongoose.model('Attendant');

function addAttendant(req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    var attendant = new Attendant({ username: user , password: pass});
    attendant.save(function (err, client) {
        if (err) handleError(req, res, 500, err);
        return res.json(client)
    });
}

function editAttendant(req, res){
    Attendant.findById(req.params.id, function (err, attendant) {
        if (err || !attendant) { handleError(req, res, 404, err);}
        if(req.body.username){attendant.username = req.body.username}
        if(req.body.password){attendant.password = req.body.password}
        attendant.save(function (err) {
            if (err) { handleError(req, res, 500, err); console.log('error when saving')}
            else {
                var returnObj = {
                    msg:  "Attendant edited succesfully.",
                    id:    attendant.id,
                    Username:  attendant.username,
                    Password: attendant.password
                };
                return res.json(returnObj);
            }
        });
    }):

    }
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

router.route('/:id')
    .post(editAttendant);