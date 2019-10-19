var express = require("express"),
    app = express(),
    request = require('request'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    Movies = require('./models/movies.js');
User = require('./models/user.js');
Comment = require('./models/comment.js');
ContactForm = require('./models/contactForm.js');
app.use(express.static('public'));
app.use(express.static('vendors'));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var flash = require('connect-flash');
app.use(flash())
//database
//Import the mongoose module

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/uwatch';
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//if connection  sucess
db.once('open', function (callback) {
    console.log("connection succeeded");
})
//passport config
app.use(require("express-session")({
    secret: "meomkarchavan",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//routes

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;

    next();
});


var total_pages = 1;
app.get("/", function (req, res) {
    if (!req.user) {
        req.flash("home_Login", "Please Log-In for Better User Experience");
        res.locals.messages = req.flash();
    } else if (req.user) {
        req.flash("welcome", "Welcome " + req.user.username + " to Uwatch");
        res.locals.messages = req.flash();
    }
    res.locals.title = "Uwatch"; // THIS LINE IS KEY
    res.render('home');
});
app.get("/user/:id/fav", isLoggedIn, function (req, res) {
    Movies.find({
        _id: req.params.id
    }, (err, movie) => {
        if (err) {
            console.log(err);
        } else {
            var fav = {
                id: movie[0]._id,
                title: movie[0].title,
                imdbID: movie[0].imdbID

            };
            // movie[0].comments.push(data);
            //     movie[0].save();
            req.user.fav_movie.push(fav);
            req.user.save()
            res.redirect("/results/" + req.params.id);

        }
    });

});
app.post("/results/:id/comments", isLoggedIn, function (req, res) {
    Movies.find({
        _id: req.params.id
    }, (err, movie) => {
        if (err) {
            console.log(err);
        } else {
            var a = req.body;
            console.log(a)
            var comment = {
                username: {
                    id: req.user._id,
                    username: req.user.username,
                    email: req.user.email
                },
                message: req.body.message,
                rating: req.body.rating,

            }

            Comment.create(comment, function (err, data) {
                if (err) {
                    console.log("err" + err);

                } else {
                    console.log(data)

                    movie[0].comments.push(data);
                    movie[0].save();
                    res.redirect("/results/" + movie[0]['_id'])
                    console.log("New comment")
                }
            });


        }

    });
});
app.get("/contactUs", function (req, res) {

    res.locals.title = "Contact Us";
    res.render('contactUs');
});
app.post("/contactUs", function (req, res) {
    var form = {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message
    }

    console.log(form)
    ContactForm.create(form, function (err, form1) {
        if (err) {
            
            res.locals.title = "Contact Us";
            res.render('sucessform',{
                isPass:false
            })
            console.log("ERRRRRRR===" + err);
        } else {
            res.locals.title = "Contact Us";
            res.render('sucessform',{
                isPass:true
            })
            console.log("movie added" + form1);
        }
    });
});

app.get("/results", function (req, res) {

    var search_key = req.query.search;
    res.locals.title = "Results-" + search_key;

    var url = "http://www.omdbapi.com/?s=" + search_key + "&apikey=b19362a8";
    request(url,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                if (data.Response === "False") {
                    res.render('404');
                } else {
                    data["Search"].forEach(function (movie) {

                        // console.log(seed);
                        Movies.find({
                            imdbID: movie.imdbID
                        }, function (err, docs) {
                            if (docs.length) {

                                console.log('Name exists already');
                            } else {
                                seed = [{
                                    title: movie.Title,
                                    imdbID: movie.imdbID
                                }];
                                console.log("no")

                                Movies.create(seed, function (err, movie) {
                                    if (err) console.log("ERRRRRRR===" + err);
                                    else {
                                        console.log("movie added");
                                    }
                                });
                            }
                        });
                    });
                    Movies.find({}, (err, allmovies) => {
                        if (err) {
                            console.log("error!!!!!!!");
                            console.log(err);
                        } else {

                            res.render("results", {
                                allmovies: allmovies,
                                data: data,
                                search_key: search_key
                            });

                        }
                    });

                }

            }
        });

});

app.get("/results/:_id", function (req, res) {
    var id = req.params._id
    var title = '';
    Movies.find({
        _id: id
    }, function (err, doc) {
        title = doc[0]['title'];
        res.locals.title = "Results-" + title;
        var url = "http://www.omdbapi.com/?t=" + title + "&plot=full&apikey=b19362a8";
        request(url,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    if (data.Response === "False") {
                        res.render('404');
                    } else {
                        Movies.find({
                            _id: id
                        }).populate("comments").exec((err, allmovies) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.render("movie_result", {
                                    allmovies: allmovies,
                                    data: data
                                });
                            }
                        });
                    }
                }
            });
    });


});



app.get("/aboutus", function (req, res) {
    res.locals.title = "About Us";

    res.render('aboutus');
});
app.get("/test", isLoggedIn, function (req, res) {
    id = req.user.fav_movie[0].id

    Movies.find({
        _id: id
    }, (err, movie) => {
        if (err) {
            console.log(err);
        } else {
            console.log(movie)

        }
    });
    res.locals.title = "About Us";
    res.render('test');
});
// 
// AUTH ROUTES
// 
//show registe form

app.get("/register", function (req, res) {
    res.locals.title = "Sign Up";

    res.render("register");
});
//handel signup
app.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username,
        email: req.body.email
    });

    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log("==================");
            // console.log(err);
            if (err.code == 11000) {

                req.flash("email", "A user with the given Email is already registered");
                res.locals.messages = req.flash();
            } else {
                req.flash(err.name, err.message);
                res.locals.messages = req.flash();
            }

            console.log("==================");
            res.locals.title = "Login";
            console.log(err)
            return res.render("login");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/");
        })
    })
});
//login
app.get('/login', function (req, res) {
    res.locals.title = "Login";

    res.render("login");
});

//handle login
app.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/loginfailed"
}), function (req, res) {


});
app.get("/loginfailed", function (req, res) {
    if (!req.user) {
        res.locals.title = "Uwatch"; // THIS LINE IS KEY

        req.flash("loginError", "Username or password is incorrect.");
        res.locals.messages = req.flash();
        res.render('login');
    }
});
//logout
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect("/");
});


app.get("/team", function (req, res) {
    res.locals.title = "Uwatch"; // THIS LINE IS KEY

    res.render('team');

});


app.get("/temp", function (req, res) {
    res.locals.title = "Uwatch"; // THIS LINE IS KEY

    res.render('temp_result');

});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
// 404
app.get("/:any", function (req, res) {
    res.status(404);
    res.locals.title = "404 Not Found";
    res.render('404');
});

var listener = app.listen(3001, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});