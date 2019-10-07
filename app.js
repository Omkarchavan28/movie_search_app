var express = require("express");
var app = express();
var request = require('request');
app.use(express.static('\public'));

//database
//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/uwatch';
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//
//login
app.post('/sign_up', function(req,res){ 
    var name = req.body.name; 
    var email =req.body.email; 
    var pass = req.body.password; 
    var phone =req.body.phone; 
  
    var data = { 
        "name": name, 
        "email":email, 
        "password":pass, 
        "phone":phone 
    } 
db.collection('details').insertOne(data,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully"); 
              
    }); 
          
    return res.redirect('signup_success.ejs'); 
}) 
  




var bodyParser =require("body-parser");

app.set("view engine", "ejs");

var total_pages = 1;
app.get("/", function (req, res) {
    res.locals.title = "Uwatch";                    // THIS LINE IS KEY
    res.render('home');
});
app.get("/signup", function (req, res) {
    res.locals.title = "Uwatch";                    // THIS LINE IS KEY
    res.render('sign_up');
});


app.get("/results", function (req, res){
    var search_key = req.query.search;
    res.locals.title = "Results-"+search_key;
    
    var url = "http://www.omdbapi.com/?s=" + search_key + "&apikey=b19362a8";
    request(url,
        function (error, response, body ) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                if(data.Response === "False") {
                    res.render('404');
                } else     {
                             res.render("results", {
                               data: data,
                               search_key:search_key
                             });
                           }

            }
        });

});
app.get("/results/:movie_title", function (req, res){
    var title = req.params.movie_title
    console.log(title);
    res.locals.title = "Results-"+title;

    var url = "http://www.omdbapi.com/?t=" + title + "&plot=full&apikey=b19362a8";
    request(url,
        function (error, response, body ) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                if(data.Response === "False") {
                    res.render('404');
                } else     {
                    //res.send(data);
                             res.render("movie_result", {
                               data: data
                             });
                           }

            }
        });

});

app.get("/aboutus", function (req, res) {
    res.locals.title = "About Us";

    res.render('aboutus');
});
app.get("/test", function (req, res) {
    
    res.render('test');
});
app.get("/:any", function (req, res) {
    res.status(404);
    res.locals.title = "404 Not Found";

    res.render('404');
});
var listener = app.listen(3001, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});