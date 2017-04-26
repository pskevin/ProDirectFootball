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
router.post('/login',Verify.verifyLoggedUser,function(request, response,next){
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
    date.setDate(date.getDate() + 6);
    console.log(data.getDate());
    User.find({"username":decoded.data.username},{"_id":"1"},function(err,user){
        Order.create(user._id,function(err,order){
            order.deliveryDate =dateformat(date,"dd:mm:yy");
            for(var i=0;i<data.length;i++)
            {
                console.log(data[i]);
                Boot.find({"bname":data[i].bname},{"_id":"1","costprice":"1","saleprice":"1"},function(err,result){
                    var profit = result.costprice - (data[i].quantity*result.costprice);
                    var j={"productId":result._id,"quantity":data[i].quantity,"salecost":data[i].salecost,"profit":profit};
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

router.post('/generateOtpPayment',Verify.verifyLoggedUser,function(request,response){
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    var x= Math.random()*(9999 - 1000)+1000;
    x= parseInt(x);
    console.log(x);
    var decoded = jwt.decode(token);
    User.find({"username":decoded.username},function(err,data){
        if(err)
            response.json(err);
        else {
            data.otp=x;
            data.save(function (err,result){
                if(err)
                    response.json(err);
                else{
                        client.sms.messages.create({
                        to: "+91"+data.mobno,
                        from: '+12053796263',
                        body: '\nPRODIRECT FOOTBALL PAYMENT GATEWAY.\nYour One Time Password(OTP) :' + x
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
router.post('/comment',function(request,response){
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    var decoded = jwt.decode(token);
    Boot.find(result.body.bname,function(err,boot){
        var j = {rating :
            {
                type : Number,
                min : 1,
                max : 5,
                required : true
            },
            remarks :
                {
                    type : String,
                    required : true
                },
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }}

    });
    User.find(decoded.data.username,function(err,result){

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
