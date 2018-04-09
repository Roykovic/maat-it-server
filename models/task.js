var mongoose = require('mongoose');

console.log('Iniializing Task schema');

var taskSchema = new mongoose.Schema({
    name: { type: String, required: true }
    startTime: { type: Date, required: true }
    endTime: { type: Date, required: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

mongoose.model('Task', taskSchema);
