var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var moment = require("moment");
var passport = require("passport"),
LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

mongoose.connect( "mongodb://newname:newname123@ds123532.mlab.com:23532/newname");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
 app.locals.moment = require("moment");
// seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Rusty is the cutest dog",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(2000, function(){
	console.log("The YelpCamp Server Has Started!");
});