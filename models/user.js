var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


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
  },
  fav_movie: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movies"
    },
    title: String,
    imdbID: {
      type: String,
      unique: true,
    },
  }]
});
UserSchema.plugin(passportLocalMongoose)
var User = mongoose.model('User', UserSchema);
module.exports = User;