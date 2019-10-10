var express       = require("express"),
    app           = express(),
    request       = require('request'),
    passport      =require('passport'),
    localStrategy =require('passport-local'),
    bodyParser    =require("body-parser"),
    mongoose      = require('mongoose'),
    User          = require('./models/user.js');  
    flash         = require('connect-flash');
app.use(express.static('public'));
app.use(express.static('aroma'));
app.set("view engine", "ejs");
//body parser

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ 
    extended: true
})); 
//database
//Import the mongoose module

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/uwatch';
mongoose.connect(mongoDB, { useNewUrlParser: true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//if connection  sucess
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 
//passport config
app.use(require("express-session")({
    secret:"meomkarchavan",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//routes

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
  });

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

app.get("/temp", function (req, res){
   res.render('temp_result');

});
app.get("/results/:movie_title", function (req, res){
    var title = req.params.movie_title
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
    res.locals.title = "About Us";
    res.render('test');
});
// 
// AUTH ROUTES
// 
//show registe form

app.get("/register",function(req,res){
    res.render("register");
});
//handel signup
app.post("/register",function(req,res){
    var newUser = new User({username: req.body.username,
                            email:req.body.email});
    
    User.register(newUser,req.body.password,function(err,user){
        if (err){
            console.log("==================");
            console.log(err);
            console.log("==================");
            return res.render("login");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/");
        })
    })
});
//login
app.get('/login',function(req,res){
    res.locals.title = "Login";

    res.render("login");
});

//handle login
app.post('/login',passport.authenticate("local",
                {
                    successRedirect:"/",
                    failureRedirect:"/login",

                }),function(req,res){
                    console.log(req.body.username)

});
//logout
app.get('/logout',function(req,res){
    req.logout();
    res.redirect("/");
});
// 404
app.get("/:any", function (req, res) {
    res.status(404);
    res.locals.title = "404 Not Found";
    res.send("404");
   // res.render('404');
});

var listener = app.listen(3001, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});