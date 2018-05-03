var mongoose = require('mongoose');

console.log('Initializing Task schema');

var taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    timer: { type: Number, required: true },
    startTime: { type: Date, required: false },
    image: { type: String, required: true }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

mongoose.model('Task', taskSchema);
