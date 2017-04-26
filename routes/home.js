var express = require('express');
var http = require('http');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var fs = require('fs');
var hostname = "localhost";
var port = 3000;
app.use(morgan('dev'));
var home = express.Router();
home.use(bodyParser.json());
home.all('/',function(request,response,next){
  console.log("in!");
  next();
})

module.exports=home;
