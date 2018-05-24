var mongoose = require('mongoose');

console.log('Iniializing attendant schema');

var attendantSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: {type: Boolean, default: false}
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

mongoose.model('Attendant', attendantSchema);