var mongoose = require('mongoose');

console.log('Iniializing Task schema');

var taskSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

mongoose.model('Task', taskSchema);
