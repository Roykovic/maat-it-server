var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;
var config = require('../config');

var mongoose = require('mongoose');
//mongoose.connect(config.mongooseUrl);
mongoose.connect('mongodb://admin:admin@ds121309.mlab.com:21309/maat-it');
Task = mongoose.model('Task');


function addTask(req, res) {
    var task = new Task({ name: req.body.name,
                            timer: req.body.timer,
                            startTime: req.body.startTime,
                            image: req.body.image
                          });

    task.save(function (err, task) {
        if (err) handleError(req, res, 500, err);
        return res.json(task)
    });
}


function getTask(req, res){
    Task.findById(req.params.id, function (err, task) {
        if (err) handleError(req, res, 500, err);
        return res.json(task)
    })
}


function deleteTask(req, res){
    Task.findByIdAndRemove(req.params.id)
    .then(task => {
        if(!task) {
            return res.status(404).send({
                message: "Task not found with id " + req.params.id
            });
        }
        res.send({message: "Task deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Task not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Could not delete Task with id " + req.params.id
        });
    });
};

function findAll(req, res){
  Task.find()
    .then(tasks => {
      res.send(task);
    }).catch(err => {
     res.status(500).send({
         message: err.message || "Some error occurred while retrieving tasks."
     });
 });
}



router.route('/')
    .get(findAll);

router.route('/:id')
    .get(getTask);

router.route('/add')
    .post(addTask);

router.route('/delete')
    .post(deleteTask);


module.exports = function (errCallback){
    console.log('Initializing Task routing module');

    handleError = errCallback;
    return router;
};
