var mongoose = require('mongoose');

console.log('Iniializing client schema');

var clientSchema = new mongoose.Schema({
    heartRate: { type: String, required: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

mongoose.model('Client', clientSchema);