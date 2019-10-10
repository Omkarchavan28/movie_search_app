// 
// AUTH ROUTES
// 
//show registe form
var express = require('express');
var router = express.Router();
var passport =require('passport');
var     localStrategy =require('passport-local');
var     User          = require('../models/user.js');  

router.get("/register",function(req,res){
    res.render("register");
});

//handel signup
router.post("/register",function(req,res){
    var newUser = new User({username: req.body.username,
                            email:req.body.email});
    
    User.register(newUser,req.body.password,function(err,user){
        if (err){
            console.log("==================");
            console.log(err);
            console.log("==================");
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/");
        })
    })
});
//login
router.get('/login',function(req,res){
    res.render("login");
});
//handle login
router.post('/login',passport.authenticate("local",
                {
                    successRedirect:"/",
                    failureRedirect:"/login"
                }),function(req,res){
                    

});
//logout
router.get('/logout',function(req,res){
    req.logout();
    res.redirect("/");
});
// 404
router.get("/:any", function (req, res) {
    res.status(404);
    res.locals.title = "404 Not Found";
    res.send("404");
   // res.render('404');
});

module.exports=router;