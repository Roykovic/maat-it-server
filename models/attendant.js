var mongoose = require('mongoose');

console.log('Iniializing attendant schema');

var attendantSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

mongoose.model('Attendant', attendantSchema);