var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

console.log('Initializing client schema');

var clientSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String},
    heartRate: { type: String, required: true },
    attendantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Attendant'}
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

clientSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

clientSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


mongoose.model('Client', clientSchema);