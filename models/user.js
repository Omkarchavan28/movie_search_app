var mongoose = require('mongoose');
var passportLocalMongoose=require('passport-local-mongoose');


var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String
  }
});
UserSchema.plugin(passportLocalMongoose)
var User = mongoose.model('User', UserSchema);
module.exports = User;
