var mongoose = require('mongoose');


var commentSchema = new mongoose.Schema({

  username: {
    id:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    username: String,
  },
  email: {
    type: String,
  },
  message: {
    type: String
  },
  ratinng: {
    type: Number
  }
});
var comment = mongoose.model('Comment', commentSchema);
module.exports = comment;