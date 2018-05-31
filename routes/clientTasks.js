var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;
var config = require('../config');

var mongoose = require('mongoose');
//mongoose.connect(config.mongooseUrl);
mongoose.connect('mongodb://admin:admin@ds121309.mlab.com:21309/maat-it');
ClientTask = mongoose.model('ClientTask');
Task = mongoose.model('Task');


function addClientTask(req, res) {
    var timer;
    Task.findById(req.body.taskId, function (err, task){
        if (err) handleError(req, res, 500, err);
        if(req.body.timer && req.body.timer > task.minTime){
            timer = req.body.timer;
        }
        else{
            timer = task.minTime;
        }
        var clientTask = new ClientTask({
            clientId: req.body.clientId,
            taskId: req.body.taskId,
            startTime: req.body.startTime,
            timer: timer
        });

        clientTask.save(function (err, clientTask) {
            if (err) handleError(req, res, 500, err);
            return res.json(clientTask)
        });
    })
}

function deleteClientTask(req, res){
    ClientTask.findByIdAndRemove(req.params.id)
        .then(clientTask => {
        if(!clientTask) {
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

function find(req, res){
    var query = {};
    if(req.query.clientId) query.clientId = req.query.clientId;

    ClientTask.find()
        .then(clientTasks => {
        res.send(clientTasks);
}).catch(err => {
        res.status(500).send({
        message: err.message || "Some error occurred while retrieving tasks."
    });
});
}



router.route('/')
    .get(find);

router.route('/')
    .post(addClientTask);

router.route('/:id')
    .delete(deleteClientTask);


module.exports = function (errCallback){
    console.log('Initializing clientTask routing module');

    handleError = errCallback;
    return router;
};
