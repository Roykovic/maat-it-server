var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;

var mongoose = require('mongoose');
mongoose.connect(config.mongooseUrl);
Picto = mongoose.model('Picto');


function addPicto(req, res) {
    var picto = new Picto({ name: req.body.name,
                            timer: req.body.timer,
                            startTime: req.body.startTime,
                            image: req.body.image
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


function deletePicto(req, res){
    Picto.findByIdAndRemove(req.params.pictoId)
    .then(picto => {
        if(!picto) {
            return res.status(404).send({
                message: "Picto not found with id " + req.params.pictoId
            });
        }
        res.send({message: "Picto deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Picto not found with id " + req.params.pictoId
            });
        }
        return res.status(500).send({
            message: "Could not delete Picto with id " + req.params.pictoId
        });
    });
};

function findAll(req, res){
  Picto.find()
    .then(pictos => {
      res.send(pictos);
    }).catch(err => {
     res.status(500).send({
         message: err.message || "Some error occurred while retrieving pictos."
     });
 });
}



router.route('/')
    .get(findAll);

router.route('/:id')
    .get(getPicto);

router.route('/add')
    .post(addPicto);

router.route('/delete')
    .post(deletePicto);


module.exports = function (errCallback){
    console.log('Initializing Picto routing module');

    handleError = errCallback;
    return router;
};
