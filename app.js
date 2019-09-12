var express = require("express");
var app = express();
var request = require('request');
app.use(express.static('public'));
app.set("view engine", "ejs");

var total_pages = 1;
app.get("/", function (req, res) {
    res.render('form');
});

app.get("/results", function (req, res) {
    var search_key = req.query.search;
    var url = "http://www.omdbapi.com/?s=" + search_key + "&apikey=b19362a8";
    request(url,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);

                if(data.Response === "False") {
                    res.render('404');
                } else     {
                             res.render("results", {
                               data: data
                             });
                           }

            }
        });

});
app.get("/:any", function (req, res) {
    res.render('404');
});
app.listen(5001, function () {
    console.log('server Started');
});