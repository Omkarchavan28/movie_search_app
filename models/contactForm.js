var mongoose = require('mongoose');


var ContactFormSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    unique: true
  },
  phone:Number,
  message: String
});
var ContactForm = mongoose.model('contactForm', ContactFormSchema);
module.exports = ContactForm;