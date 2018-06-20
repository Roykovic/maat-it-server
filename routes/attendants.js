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
    console.log(user);
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

function authenticate(req, res) {
    Attendant.findOne({username: req.body.username}, function (err, attendant) {
        if (err || !attendant) {
            handleError(req, res, 404, err);
            console.log('error when saving')
        }
        else {
            // test a matching password
            attendant.comparePassword(req.body.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    const payload = {
                        admin: attendant.admin
                    };
                    var token = jwt.sign(payload, process.env.secretKey, {
                        expiresIn: 60 * 60 * 24 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        user_id: attendant._id,
                        token: token
                    });
                } else {
                    handleError(req, res, 401, err);
                    console.log('Wrong password')
                }
            });
        }
    });
}

router.route('/')
    .post(addAttendant)

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

router.route('/')
    .get(findAll);

router.route('/:id')
    .post(editAttendant)
    .get(find);


module.exports = function (errCallback){
    console.log('Initializing attendants routing module');

    handleError = errCallback;
    return router;
}