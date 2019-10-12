var mongoose = require('mongoose');


var movieSchema = new mongoose.Schema({
    title: String,
    imdbID: {
        type: String,
        unique: true,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});
var movies = mongoose.model('movies', movieSchema);
module.exports = movies;