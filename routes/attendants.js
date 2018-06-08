var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;
var config = require('../config');
var index = require('../index');
var jwt    = require('jsonwebtoken');

var mongoose = require('mongoose');
//mongoose.connect(config.mongooseUrl);
mongoose.connect('mongodb://admin:admin@ds121309.mlab.com:21309/maat-it');
Attendant = mongoose.model('Attendant');

function addAttendant(req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    var isAdmin = req.body.isAdmin;
    var attendant = new Attendant({ username: user , password: pass, isAdmin: isAdmin});
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
        if(req.body.isAdmin){attendant.isAdmin = req.body.isAdmin}
        attendant.save(function (err) {
            if (err) { handleError(req, res, 500, err); console.log('error when saving')}
            else {
                var returnObj = {
                    msg:  "Attendant edited succesfully.",
                    id:    attendant.id,
                    Username:  attendant.username,
                    Password: attendant.password,
                    IsAdmin: attendant.isAdmin
                };
                return res.json(returnObj);
            }
        });
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

function find(req, res){
    Attendant.findById(req.params.id, function (err, attendant) {
        if (err) { handleError(req, res, 404, err); console.log('error when saving')}
            else {
                return res.json(attendant);
            }
        });
}

function authenticate(req, res){
  Attendant.findOne( { $and: [ { username: req.body.username }, { password: req.body.password } ] }, function(err, attendant) {
      if (err || !attendant) { handleError(req, res, 404, err); console.log('error when saving')}
      else{
          const payload = {
              admin: attendant.admin
          };
          var token = jwt.sign(payload, process.env.secretKey, {
              expiresIn : 60*60*24 // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
              success: true,
              user_id: attendant._id,
              token: token
          });
      }
  });
}


router.route('/')
    .post(addAttendant)
    .get(findAll);

router.route('/auth')
    .post(authenticate);

router.route('/:id')
    .post(editAttendant)
    .get(find);


module.exports = function (errCallback){
    console.log('Initializing attendants routing module');

    handleError = errCallback;
    return router;
}