var mongoose = require('mongoose');

console.log('Iniializing Picto schema');

// Een picto moet een naam hebben, een timer, start datetime en de image url

var pictoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    timer: { type: int, required: true },
    startTime: { type: datetime, required: true },
    image: { type: String, required: true }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

mongoose.model('Picto', pictoSchema);
