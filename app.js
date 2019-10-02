var express = require("express");
var app = express();
var request = require('request');
app.use(express.static('\public'));

var bodyParser =require("body-parser");

app.set("view engine", "ejs");

var total_pages = 1;
app.get("/", function (req, res) {
    res.locals.title = "Uwatch";                    // THIS LINE IS KEY
    res.render('home');
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