const express = require('express');
const passport = require('passport');
const app = express();
//const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const path =require('path');
const flash = require('connect-flash');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
//const passportSetup=require('./configs/passportSetup');


app.set('view-engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
//app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,'/public')));


// Routes
app.use('/', require('./routes/index.js'));
app.use('/auth', require('./routes/userForm.js'));


// Passport Config
 require('./configs/passportSetup')(passport);

// DB Config
const db = require('./configs/keys').MongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}// returns a promise hence used then and catch
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS

app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session

const sessionOptions={
    secret : "secret", 
    resave : true, 
    saveUninitialized : true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000, // 1 week
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },

};

app.use(session(sessionOptions));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
//generates a function that is used in passports local strategy


app.use(flash());

//defining flash success middleware
app.use((req,res,next)=>{
    res.locals.success_msg= req.flash('success_msg');
    // add<%= success_msg %> at the top of index.ejs that will be the home page of your app
    // check phase 2part c last 2 videos check it
    res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
    next();
    });



app.listen(8080,() => { 
    console.log("listening to port: 8080");
   });



