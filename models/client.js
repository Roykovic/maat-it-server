var mongoose = require('mongoose');

console.log('Iniializing client schema');

var clientSchema = new mongoose.Schema({
    name: {type: String, required: true},
    heartRate: { type: String, required: true },
    attendantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Attendant'}
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

mongoose.model('Client', clientSchema);