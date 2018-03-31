var mongoose = require('mongoose');
var bcrypt = require('bcryptjs'); 

var UserSchema = mongoose.Schema({
    Email:{
        type: String,
        index:true
    },
    FirstName:{
        type: String
    },
    LastName:{
        type: String
    },
    Address:[{
        Street:String,
        City:String,
        Province:String,
        PostalCode:String,
        Country:String
    }],
    Password:String,
    Role :String,
    CreationDate :{ type: Date, default: Date.now }
})



var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.Password, salt, function(err, hash) {
            newUser.Password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByEmail = function(email, callback) {
    User.findOne({Email: email}, callback);
}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback); 
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}


