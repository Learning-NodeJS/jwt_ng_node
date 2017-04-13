var mongoose = require('mongoose');
mongoose.Promise = Promise;
var bcrypt = require('bcrypt-nodejs');

mongoose.set('debug', true);

var UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  displayName: String
});
UserSchema.pre('save', function(next){
  var user = this;
  console.log("user email: ",user.email);
  console.log("user password: ",user.password);
  if(!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt){
    if(err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash){
      if (err) return next(err);

      user.password = hash;
      next();

    });
  });
});

UserSchema.methods.toJSON = function () {
    var user =  this.toObject();
    delete user.password;
    return user;
}

UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, callback);
}

module.exports = mongoose.model('User', UserSchema);
//var User = mongoose.model('User', UserSchema);
