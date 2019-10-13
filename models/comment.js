var mongoose = require('mongoose');


var commentSchema = new mongoose.Schema({

  username: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String,
    email: String
  },

  message: {
    type: String
  },
  rating: {
    type: Number
  }
});
var comment = mongoose.model('Comment', commentSchema);
module.exports = comment;