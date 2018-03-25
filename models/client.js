var mongoose = require('mongoose');

console.log('Iniializing client schema');

var clientSchema = new mongoose.Schema({
    id: { type: Number, unique: true},
    heartRate: { type: String, required: true },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});