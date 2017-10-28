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

exports.verifyLoggedUser = function(request, response, next) {
    // check header or url parameters or post parameters for token
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    // console.log(token);
    // console.log(request.query.token);
    // console.log(request.body.token);
    // console.log(request.headers['x-access-token']);
    if (token) {
        jwt.verify(token, config.secretKey, function(err, decoded) {
            if (err) {
                if (err.name == "TokenExpiredError"){
                    decoded = jwt.decode(token);
                    //                console.log(decoded.data);
                    User.findByIdAndUpdate(decoded.data._id, {$set:{"logged":false}},
                        {new: true}, function (error, new_data) {
                            if (error)
                                throw error;
                            else
                            {
                                console.log(new_data);
                                response.json('Token Expired');
                            }
                        });
                }
                else {
                    response.json(err);
                }
            }
            else
            {
                // if everything is good, save to request for use in other routes
                //        console.log(decoded);
                next();
            }
        });
    }
    else
    {
      console.log('no t!!!!!');
        // if there is no token
        // return an error
        response.json('No token provided!!!');
    }
};

exports.verifyAdmin = function(request, response, next) {

    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secretKey, function(err, decoded) {
            if (err) {
                response.json(err);
            }
            else
            {
                // if everything is good, save to request for use in other routes
                if(decoded.admin==false)
                {
                    response.json("Not an Administrator");
                }
                else
                    next();
            }
        });
    }
    else
    {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        response.json(err);
    }
};

exports.verifyVerified = function(request, response, next) {

    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secretKey, function(err, decoded) {
            if (err) {
                response.json(err);
            }
            else
            {
                // if everything is good, save to request for use in other routes
                if(decoded.verified==false)
                {
                    response.json("Not a verified account");
                }
                else
                    next();
            }
        });
    }
    else
    {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        response.json(err);
    }
};

exports.trim_nulls = function (data) {
    var y;
    for (var x in data) {
        y = data[x];
        console.log("Inside!:"+JSON.stringify(y).charAt(3));
        if(JSON.stringify(y).charAt(2)=='$' && JSON.stringify(y).charAt(9)!='"')
            continue;
        if (y === "null" || y === null ||JSON.stringify(y)=='{"$in":[""]}'|| y === "" || typeof y === "undefined" || (y instanceof Object && Object.keys(y).length == 0)) {
            console.log(data[x]);
            delete data[x];
            console.log(data);
        }
        if (y instanceof Object && JSON.stringify(y).charAt(2)!='$') y = trim_nulls(y);
        console.log(data);
    }
    return data;
};
