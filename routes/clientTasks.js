var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;
var config = require('../config');

var mongoose = require('mongoose');
//mongoose.connect(config.mongooseUrl);
mongoose.connect('mongodb://admin:admin@ds121309.mlab.com:21309/maat-it');
clientTask = mongoose.model('ClientTask');
Task = mongoose.model('Task');


function addClientTask(req, res) {
    var reqTask;
    var timer;
    Task.findById(req.params.taskId, function (err, task) {
        if (err) handleError(req, res, 500, err);
        var reqTask = task;
        if(req.body.startTime && req.body.startTime > reqTask.minTime){
            timer = req.body.startTime;
        }
        else{
            timer = reqTask.minTime;
        }
        var clientTask = new clientTask({
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
    clientTask.findByIdAndRemove(req.params.id)
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

    clientTask.find()
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

router.route('/add')
    .post(addClientTask);

router.route('/delete')
    .post(deleteClientTask);


module.exports = function (errCallback){
    console.log('Initializing clientTask routing module');

    handleError = errCallback;
    return router;
};
