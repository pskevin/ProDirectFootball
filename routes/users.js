var express = require('express');
var router = express();
var http = require('http');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var dateformat = require('dateformat');
var path = require('path');
var fs = require('fs');
var config = require('./config.js');
var User = require('../models/user');
var Boot = require('../models/boots');
var Order = require('../models/order');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Verify = require('./verify');
var twilio = require('twilio');
var api_key = 'key-3817130671e1c1f13919a3469f5e1386';
var domain = 'sandbox127c4a0962454b07a273d25721d8887d.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var client = new twilio.RestClient('AC7f3c18f7892caa2aaee44f474017e2c8','6ff1819b8dc09ebd338d35aafde0a76c');
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
        if(user.verified!=true)
        {
            response.json("Unverified account!");
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
                    user.logged = true;
                    user.save(function (err, new_data) {
                        if (err)
                            response.json(err);
                        else {
                            console.log(new_data);
                            var t = Verify.getToken(user);
                            console.log("Success!!!!" + user.admin + "   \n" + user);
                            response.status(200).json({
                                status: 'Login successful!',
                                success: true,
                                token: t
                            });
                        }
                    });
                }
            });
        }
    })(request,response,next);
});

router.post('/purchase',Verify.verifyLoggedUser,function(request,response){
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    var decoded = jwt.decode(token);
    var data =request.body;
    var date = new Date();
    User.findOne({"username":decoded.data.username},{"_id":"1"},function(err,user){
        Order.create(user._id,function(err,order){
            for(var i=0;i<data.length;i++)
            {
                console.log(data[i]);
                Boot.find({"bname":data[i].bname},{"_id":"1","costprice":"1","saleprice":"1"},function(err,result){
                    var profit = result.costprice - (data[i].quantity*result.costprice);
                    var j={productId:result._id,quantity:data[i].quantity,salecost:data[i].salecost,profit:profit};
                    order.product.push(j);
                });
            }
            order.save(function (err,res){
               if(err)
                   response.json(err);
                else
                    response.json(res);
            });
        });
    });
 });

router.post('/generateOtp',Verify.verifyLoggedUser,function(request,response){
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    var x= Math.random()*(9999 - 1000)+1000;
    x= parseInt(x);
    console.log(x);
    var decoded = jwt.decode(token);
    User.findOne({"username":decoded.username},function(err,data){
        if(err)
            response.json(err);
        else {
            data.otp=x;
            data.save(function (err,result){
                if(err)
                    response.json(err);
                else{
                        var text;
                        if(request.body.flag==1)
                            text='\nPRODIRECT FOOTBALL PAYMENT GATEWAY.\nYour One Time Password(OTP) :'+x;
                        else
                            text='\nPRODIRECT FOOTBALL USER REGISTERATION VERIFICATION.\nYour One Time Password(OTP) :'+x;

                    client.sms.messages.create({
                        to: "+91"+data.mobno,
                        from: '+12053796263',
                        body: text
                    }, function (error, message) {
                        if (!error) {
                            console.log('Success! The SID for this SMS message is:');
                            console.log(message.sid);
                            console.log('Message sent on:');
                            console.log(message.dateCreated);
                            response.json(message);
                        } else {
                            console.log('Oops! There was an error.' + err);
                        }
                    });
                }
            });
        }
    });
});

router.post('/verifyOtp',Verify.verifyLoggedUser,function(request,response){
    var decoded = jwt.decode(token);
    User.findOne({"username":decoded.username},function(err,data) {
        if (err)
            response.json(err);
        else {
            if(data.otp==request.body.otp) {
                if(request.body.flag==1)// Payment Successful
                {
                    var data = {
                        from: 'ProDirect Customer services <postmaster@sandbox127c4a0962454b07a273d25721d8887d.mailgun.org>',
                        to:data.email,
                        subject: 'Hello',
                        text: 'Hello '+data.firstname+",\nYour transaction has been successfully completed. The cost of $"+request.body.total+" has been deducted from your account.Thank you for using Prodirect Football.\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tThanking You,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tAkshat"
                    };
                    mailgun.messages().send(data, function (error, body) {
                        if(error)
                            response.json(error);
                        else {
                            console.log(body);
                        }
                    });
                    client.sms.messages.create({
                        to: "+91"+data.mobno,
                        from: '+12053796263',
                        body: '\nPRODIRECT FOOTBALL CUSTOMER SERVICE\nHello '+data.firstname+",\nYour transaction has been successfully completed. The cost of $"+request.body.total+" has been deducted from your account.Thank you for using Prodirect Football."
                    }, function (error, message) {
                        if (!error) {
                            console.log('Success! The SID for this SMS message is:');
                            console.log(message.sid);
                            console.log('Message sent on:');
                            console.log(message.dateCreated);
                        } else {
                            response.json('Oops! There was an error.' + err);
                        }
                    });
                response.json("Successful Transaction!");

                }
                else{
                    data.verified=true;
                    data.save(function (err,result){
                        if(err)
                            response.json(err);
                        else
                            response.json("Account successfully verified!");

                    })
                }
            }
            else
            {
                response.json("OTP match failed. Enter correct OTP.");
            }
        }
    });
        });

router.post('/comment',function(request,response){
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    var decoded = jwt.decode(token);
    Boot.findOne({"bname":request.body.bname},function(err,boot){
        if(err)
            response.json(err);
        else {
            console.log(boot);
            User.findOne({"username":decoded.data.username}, {"_id": "1"}, function (err, result) {
                if (err)
                    response.json(err);
                else {
                    console.log(result);
                    var j = {rating: request.body.rating, remarks: request.body.remarks, postedBy: result._id};
                    console.log(j);
                    boot.comments.push(j);
                    boot.save(function (err, data) {
                        if (err)
                            response.json(err);
                        else {
                            console.log(data);
                            response.json("successfully added comment!")
                        }
                    });
                }
            });
        }

    });
});

router.get('/orders',Verify.verifyLoggedUser,function(request,response){
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    var decoded = jwt.decode(token);
    User.findOne({"username":decoded.data.username}, {"_id": "1"}, function (err, result) {
        Order.find({"userId":result._id},{"profit":"0"},function(err,data){
           response.json(data);
        });
    });
});
router.post('/f',function(request,response){
    var date = new Date();
    date.setDate(date.getDate() + 6);
    response.json(dateformat(date,"dd:mm:yy"));

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
