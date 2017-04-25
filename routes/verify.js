var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config.js');
var express = require('express');
var User= require('../models/user');
var Boot = require('../models/boots');

exports.getToken = function(user) {
    console.log("Successs!!!!"+user+"   \n"+user);
    return jwt.sign({data:user},config.secretKey,{
        expiresIn: 3600
    });
};
exports.verifyUsername = function(request, response, next) {
    console.log(request.body);
    User.find({username:request.body.username},function (err, idata) {
        if(idata[0]==undefined)
            next();
        else {
            response.json("Username is already used");
        }
    });
};

exports.trim_nulls = function (data) {
    var y;
    for (var x in data) {
        y = data[x];
        if (y==="null" || y===null || y==="" || typeof y === "undefined" || (y instanceof Object && Object.keys(y).length == 0)) {
            delete data[x];
        }
        if (y instanceof Object) y = trim_nulls(y);
    }
    return data;
};
