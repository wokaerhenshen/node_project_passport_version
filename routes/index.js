var express = require("express");
var router = express.Router();
var mongojs = require("mongojs");
var config = require("../config/");
var db = mongojs(config.database);
var User = require("../models/user")
var passport = require("passport")
var LocalStrategy = require("passport-local").Strategy

router.get("/", function(req, res, next) {


    //create test user
    // var testUser = new User({
    //     FirstName: "Pacific",
    //     LastName: "Boat Club",
    //     Address: {
    //         Street: "123 Seaside Road",
    //         City: "Vancouver",
    //         Province: "BC",
    //         PostalCode: "V4R Y6T",
    //         Country: "Canada"
    //     },
    //     Email: "a@a.a",
    //     Password: "P@$$w0rd",
    //     Role: "admin"
        
    // })

    // User.createUser(testUser,function(err,user){
    //     if (err){
    //         res.status(500)
    //         res.send({err:"err occur"})
    //         return 
    //     }
    //     else {
    //         console.log("successfully craeted user")
    //         res.status(200)
    //         res.json({ success: true});
    //         return      
    //     }
    // })
    res.render("index",{title:"EXPRESS MONGO"})
});

router.get("/secure",ensureAuthenticated, function(req, res, next){
    res.render("secure",{title:"Secure Page"})
})

router.get("/unauthorised", function(req, res, next){
    res.render("unauthorised",{title:"unauthorised Page"})
})

router.get('/logout', function (req, res, next) {
    //delete req.session.authenticated;
    req.logout();
    //req.flash('success_msg', 'You are logged out.');
    res.render("index",{title:"login Page",success:"you logged out"})
   // res.redirect('/');
});

// hashed login method:
passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ Email: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, {message: 'Unknown User'}); }
        User.comparePassword(password,user.Password,function(err,isMatch){
            if (err) throw err
            if (isMatch){
                if (user.Role != "admin"){return done(null,false,{message: 'you are not admin'})}
                return done(null, user)
            }else {
                return done(null, false, {message: 'Invalid Password'})
            }
        })
      });
    }
  ));

router.post("/login",
passport.authenticate('local',{
    successRedirect: '/boats/list', 
    failureRedirect: '/',
    failureFlash: true

}),
function(req,res){
    res.redirect('/')
}
)


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function (id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', "You are not logged in");
        res.redirect('/');
    }
}



module.exports = router;
