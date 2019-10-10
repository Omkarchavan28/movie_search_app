
var express = require('express');
var router = express.Router();
User          = require('../models/user.js');  


router.get("/aboutus", function (req, res) {
    res.locals.title = "About Us";

    res.render('aboutus');
});
router.get("/test", function (req, res) {
    
    res.render('test');
});
module.exports=router;