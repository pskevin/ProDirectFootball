var express = require('express');
var router = express();
var http = require('http');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var config = require('./config.js');
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Verify = require('./verify');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));
router.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//====================================================================================
//===========================IMPLEMENTATION===========================================
router.use(morgan('dev'));
//====================================================================================
//===========================ROUTING==================================================
router.post('/register',Verify.verifyUsername,function(request, response){
    console.log("in!");
    User.register(new User({ username : request.body.username }),
    request.body.password,function(err, user){
        if(err)
        {
            response.status(500).json({err: err});
        }
        if(request.body.Fname) {
            user.Fname = request.body.Fname;
        }
        if(request.body.Mname) {
            user.Mname = request.body.Mname;
        }
        if(request.body.Lname) {
            user.Lname = request.body.Lname;
        }
        if(request.body.mobno) {
            user.mobno = request.body.mobno;
        }
        if(request.body.email) {
            user.email = request.body.email;
        }
        if(request.body.address)
        {
            user.address = request.body.address;
        }
        user.save(function(err,user){
            if(err)
                throw err;
            else
            {
                console.log(user);
                passport.authenticate('local')(request, response, function () {
                response.status(200).json({status: 'Registration Successful!'});
                });
            }
        });
    });
});
router.post('/login',function(request, response,next){
    passport.authenticate("local",function(err,user){
        console.log("\n\n\n\n");
        console.log(user);
        if (err) {
            response.status(500).json({err: err});
        }
        else
        if (!user) {
            console.log("false user");
            response.json("Unauthorized");
        }
        else
        {
            console.log("In");
            request.logIn(user, function (err) {
                if (err) {
                    response.status(500).json({err: 'Could not log in user'});
                }
                else
                {
                    console.log("In");
                    var t = Verify.getToken(user);
                    console.log("Successs!!!!" + user.admin + "   \n" + user);
                    response.status(200).json({
                        status: 'Login successful!',
                        success: true,
                        token: t
                        });
                }
            });
        }
    })(request,response,next);
});

router.get('/logout',function(request, response){
    console.log("\n\n\nINSIDE!!!\n\n");
    request.logout();
    response.status(200).json({
    status: 'Bye!'
    });
});
//====================================================================================
module.exports = router;
