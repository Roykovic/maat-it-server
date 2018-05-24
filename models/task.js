var mongoose = require('mongoose');

console.log('Initializing Task schema');

var taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    minTime: { type: Number, required: true },
    image: { type: String, required: true }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

mongoose.model('Task', taskSchema);
