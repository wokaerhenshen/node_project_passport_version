var express = require("express");	
var cookieParser = require("cookie-parser")
var session = require('express-session')
var validator = require('express-validator')
var flash = require('connect-flash');
var path = require("path");
var bodyParser = require("body-parser");
var index = require("./routes/index");
var boats = require("./routes/boats");  
var users = require("./routes/users");
var angular = require("./routes/angularStuff")  
var config = require('./config');
var jwt = require('jsonwebtoken');

//passport (authanticate stuff)
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; 
var jwt = require('jsonwebtoken');

// mongoose
var mongoose = require('mongoose');
mongoose.connect(config.database);
var db = mongoose.connection;
var app = express();

// View engine
var ejsEngine = require("ejs-locals");
app.engine("ejs", ejsEngine);           // support master pages
app.set("view engine", "ejs");          // ejs view engine

// Set static folder
app.use(express.static(path.join(__dirname, "clients")));

// enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next();
  });

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser())

app.use(session({secret: 'max', saveUninitialized: false, resave: false}))

//old and ugly method is check authanticate
// app.use(checkAuth)

// passport initialization
app.use(passport.initialize());
app.use(passport.session());

// bring in passport strategy we defined
require('./config/passport')(passport);


// express validator
app.use(validator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.');
        var root = namespace.shift();
        var formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}));

// connect flash middleware
app.use(flash());

// global vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
    next();
});

app.use("/", index);
app.use("/boats", boats);
app.use("/users", users);
app.use("/angular",angular)


app.listen(config.port, function() {
    console.log("Server started on port " + config.port)
});
