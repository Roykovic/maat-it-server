var mongoose = require('mongoose');

console.log('Initializing clientTask schema');

var clientTaskSchema = new mongoose.Schema({
    clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    taskId: {type: mongoose.Schema.Types.ObjectId, ref: 'Task'},
    startTime: { type: Date, required: false },
    timer: { type: Number, required: true }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

mongoose.model('ClientTask', clientTaskSchema);
