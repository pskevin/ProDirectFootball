var express = require('express');
var http = require('http');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var fs = require('fs');
var hostname = "localhost";
var passport = require('passport');
//var Verify    = require('./verify');
var mongoose = require('mongoose'),
    assert = require('assert');
var Pro = require('../models/data-2.js');

var port = 3000;
app.use(morgan('dev'));
var login = express.Router();
login.use(bodyParser.json());
login.route('/')
.post(function(request,response){
  passport.authenticate('local', function(err, user, info) {
    console.log(user+"logged in!asd"+info);
    if (err) {
      throw err;
    }
    if (!user){
      //throw err;
      //response.method="GET";
      response.redirect('back');
    }
    else {
      request.logIn(user, function(err) {
      if (err) {
        throw err;
        }
        else {
          console.log(user+"logged in!"+info);
          response.redirect('/home-page.html');
        }
      });
    }
  })(request,response);
  console.log("logged in!");
});
module.exports= login;
