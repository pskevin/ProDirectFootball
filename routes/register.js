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
var register = express.Router();
register.use(bodyParser.json());
register.route('/')
.post(function(request,response,next){
  console.log(request.body);
  findId(function(rid){
    id=rid;
    console.log("id  :- "+id);
    addUser(request,response,id);
    console.log("added");
    response.redirect('/');
  });


})
function findId(callback)
{
  var id;
  //Pro.find({}).limit(1).select({id : 1}).exec(callback);

  Pro.findOne({},{},{sort : {$natural : -1}},function(error,userdata){
    console.log("\n\nInside it~");
    if (error)
    {
      throw error;
    }
    if(userdata==null)
      id = "P0001";
    else
    {
      console.log("\n\nFound it :"+userdata.id);
      id= userdata.id;
      var newId = parseInt(id.substring(1,5));
      newId++;
      console.log(newId);
      id='P';
      var count=0;
      while(count<(4-newId.toString().length))
      {
        id = id+'0';
        count++;
      }
      id=id+newId.toString()
      console.log("id :-"+id);
    }
    callback(id);
  });
}
function addUser(request,response,id)
{
  Pro.register(new Pro({ username : request.body.email }),
    request.body.pass, function(err, user) {
    if (err) {
        throw(err);
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
    if(id) {
      user.id = id;
    }
    console.log("Fname:"+user.Fname);
    user.save(function(err,user) {
    if(err)
      throw err;
      passport.authenticate('local'),function (req,res){
        console.log('Registration Successful!');
      };
    });
  });
}


module.exports=register;
