var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;

var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds121309.mlab.com:21309/maat-it');
Picto = mongoose.model('Picto');


function addPicto(req, res) {
    var picto = new Picto({ name: '', // TODO hier moeten we nog een input voor hebben
                            timer: null,
                            startTime: now(),
                            image: ''
                          });

    picto.save(function (err, picto) {
        if (err) handleError(req, res, 500, err);
        return res.json(picto)
    });
}


function getPicto(req, res){
    Picto.findById(req.params.id, function (err, picto) {
        if (err) handleError(req, res, 500, err);
        return res.json(picto)
    })
}


router.route('/:id')
    .get(getPicto);

router.route('/add')
    .post(addPicto);

module.exports = function (errCallback){
    console.log('Initializing Picto routing module');

    handleError = errCallback;
    return router;
};
