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
var _ = require('underscore');
var async = require('async');
var api_key = 'key-3817130671e1c1f13919a3469f5e1386';
var domain = 'sandbox127c4a0962454b07a273d25721d8887d.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var client = require('twilio')('AC7f3c18f7892caa2aaee44f474017e2c8','6ff1819b8dc09ebd338d35aafde0a76c');
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
    if (user.logged==true) {
      response.json("Already logged in");
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

router.post('/checkStock',Verify.verifyLoggedUser,function(request,response) {
  var token = request.body.token || request.query.token || request.headers['x-access-token'];
  var decoded = jwt.decode(token);
  var dat = request.body.data;
  var k = [];
  var x = async.each(dat, function (data, callback) {
    console.log(data);
    Boot.findOne({"bname": data.bname}, {
      "_id": "1",
      "costprice": "1",
      "saleprice": "1",
      "stock" : "1"
    }, function (err, result) {
      if (err)
      callback(err);
      else {
        if(request.stock<data.quantity)
        {
          var j = {bname:result.bname,stock : result.stock};
        }  k.push(j)

        callback(null);
      }
    });
  }, function (err,bname) {
    if (err) {
      response.json(err);
    }
    else {
      response.json(k);
    }
  });
});

router.post('/purchase',Verify.verifyLoggedUser,function(request,response) {
  var token = request.body.token || request.query.token || request.headers['x-access-token'];
  var decoded = jwt.decode(token);
  var dat = request.body.data;
  User.findOne({"username": decoded.data.username}, {"_id": "1","orders":"1"}, function (err, user) {
    if (err)
    response.json(err);
    else {
      var k = [];
      var x = async.each(dat, function (data, callback) {
        console.log(data);
        Boot.findOne({"bname": data.bname}, {
          "_id": "1",
          "costprice": "1",
          "saleprice": "1"
        }, function (err, result) {
          if (err)
          callback(err);
          else {
            console.log(result);
            var profit = data.quantity * (result.saleprice - result.costprice);
            var salecost = data.quantity * result.saleprice;
            var j = {
              productId: result._id,
              quantity: data.quantity,
              salecost: salecost,
              profit: profit
            };
            k.push(j);
            //console.log(k);
            callback(null);
          }
        });
      }, function (err) {
        if (err) {
          response.json(err);
        }
        else {
          console.log(k);
          Order.create({"userId": user._id, "product": k}, function (err, result) {
            if (err)
            response.json(err);
            else
            {
              console.log(user.orders);
              user.orders.push({"orderId":result._id});
              user.save(function(err,res){
                if(err)
                response.json(err);
                else
                response.json("order placed!");
              });
            }
          });
        }
      });
    }
  });
});


router.post('/generateOtpPayment',Verify.verifyLoggedUser,function(request,response){
  var token = request.body.token || request.query.token || request.headers['x-access-token'];
  var x= Math.random()*(9999 - 1000)+1000;
  x= parseInt(x);
  console.log(x);
  var decoded = jwt.decode(token);
  User.findOne({"username":decoded.data.username},function(err,data){
    if(err)
    response.json(err);
    else {
      data.otp=x;
      data.save(function (err,result){
        if(err)
        response.json(err);
        else{
          var text='\nPRODIRECT FOOTBALL PAYMENT GATEWAY.\nYour One Time Password(OTP) :'+x;

          client.messages.create({
            to: "+91"+data.mobno,
            from: '+15752147818',
            body: text
          }).then(function(message) {
            if (message.err_code === null) {
              console.log('Success! The SID for this SMS message is:');
              console.log(message.sid);
              console.log('Message sent on:');
              console.log(message.dateCreated);
              response.json(message);
            } else {
              console.log('Oops! There was an error.' + message.err_message);
            }
          });
        }
      });
    }
  });
});


router.post('/generateOtpVerifyMessage',function(request,response){
  var x= Math.random()*(9999 - 1000)+1000;
  x= parseInt(x);
  console.log(x);
  console.log(request.body);
  User.findOne({"username":request.body.username},function(err,data){
    if(err)
    response.json(err);
    else {
      console.log("username:"+data);
      data.otp=x;
      data.save(function (err,result){
        if(err)
        response.json(err);
        else{
          var text="Hello "+data.Fname+",Your One Time Password(OTP) :"+x;

          client.messages.create({
            to: "+91"+data.mobno,
            from: '+15752147818',
            body: text
          }).then(function(message) {
            if (message.err_code === null) {
              console.log('Success! The SID for this SMS message is:');
              console.log(message.sid);
              console.log('Message sent on:');
              console.log(message.dateCreated);
              response.json(message);
            } else {
              console.log('Oops! There was an error.' + message.err_message);
            }
          });
        }
      });
    }
  });
});


router.post('/generateOtpVerifyMail',function(request,response){
  var x= Math.random()*(9999 - 1000)+1000;
  x= parseInt(x);
  console.log(x);
  console.log(request.body);
  User.findOne({"username":request.body.username},function(err,data){
    if(err)
    response.json(err);
    else {
      console.log(data);
      data.otp=x;
      data.save(function (err,result){
        if(err)
        response.json(err);
        else{
          var text='\nPRODIRECT FOOTBALL CUSTOMER SERVICES.\nYour One Time Password(OTP) :'+x;
          console.log(data.email);
          var dat = {
            from: 'ProDirect Customer services <postmaster@sandbox127c4a0962454b07a273d25721d8887d.mailgun.org>',
            to:data.email,
            subject: 'Hello',
            text: 'Hello '+data.Fname+",\nYour One Time Password(OTP) :"+x+"Thank you for using Prodirect Football.\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tThanking You,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tAkshat"
          };
          mailgun.messages().send(dat, function (error, body) {
            if(error)
            response.json(error);
            else {
              console.log(body);
              response.json("MAIL SENT");
            }
          });

        }
      });
    }
  });
});


router.post('/verifyOtpAccount',function(request,response){
  console.log(request.body);
  User.findOne({"username":request.body.username},function(err,data) {
    if (err)
    response.json(err);
    else {
      console.log(data);
      if(data.otp==request.body.otp) {
        data.verified=true;
        data.save(function (err,result){
          if(err)
          response.json(err);
          else
          response.json("Account successfully verified!");

        })
      }
      else
      {
        response.json("OTP match failed. Enter correct OTP.");
      }
    }
  });
});

router.post('/verifyOtpPayment',Verify.verifyLoggedUser,function(request,response){
  var token = request.body.token || request.query.token || request.headers['x-access-token'];
  var decoded = jwt.decode(token);
  User.findOne({"username":decoded.data.username},function(err,data) {
    if (err)
    response.json(err);
    else {
      if(data.otp==request.body.otp){
        var dat = {
          from: 'ProDirect Customer services <postmaster@sandbox127c4a0962454b07a273d25721d8887d.mailgun.org>',
          to:data.email,
          subject: 'Hello',
          text: 'Hello '+data.Fname+",\nYour transaction has been successfully completed. The cost of $"+request.body.total+" has been deducted from your account.Thank you for using Prodirect Football.\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tThanking You,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tAkshat"
        };
        mailgun.messages().send(dat, function (error, body) {
          if(error)
          response.json(error);
          else {
            console.log(body);
          }
        });
        var text = 'PRODIRECT FOOTBALL.Hello '+data.Fname+", transaction successful.Amount deducted from account -"+request.body.total+" pounds.";
        client.messages.create({
          to: "+91"+data.mobno,
          from: '+15752147818',
          body: text
        }).then(function(message) {
          if (message.err_code === null) {
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);
            console.log('Message sent on:');
            console.log(message.dateCreated);
          } else {
            console.log('Oops! There was an error.' + message.err_message);
          }
        });
        response.json("Successful Transaction!");
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
  User.findOne({"username":decoded.data.username}, {"orders.orderId": "1"}).populate({path:"orders.orderId",select:["product.productId"],populate:{path:"product.productId",select:["bname"]}}).exec(function (err, result) {
    if (err)
    response.json(err);
    else {
      Boot.findOne({"bname":request.body.bname},{"bname":"1","_id":"1","comments":"1"},function(err,boot){
        if(err)
        response.json(err);
        else {
          //console.log(result.orders);
          var x= async.each(result.orders,function(data,callback) {
            console.log(data);
            var y = async.each(data.orderId.product, function (b,callback) {
              console.log(b);
              if (b.productId.bname === boot.bname)
              callback("success");
              else
              callback("not found");
            },function(res){
              callback(res);
            });
          },function(res){
            if(res=="success") {
              console.log(boot.comments);
              var id = _.reject(boot.comment, function (num) {
                return num.postedBy == result._id;
              });
              console.log(id);
              if (id)
              var j = {
                rating: request.body.rating,
                remarks: request.body.remarks,
                postedBy: result._id
              };
              id.push(j);
              // console.log(j);
              boot.comments = id;
              boot.save(function (err, data) {
                if (err)
                response.json(err);
                else {
                  //            console.log(data);
                  response.json("successfully added comment!")
                }
              });

            }
            else
            {
              response.json("Buy before talking about it!");
            }
          });
          //console.log("boot:"+boot);
        }
      });
    }

  });
});

router.get('/orders',Verify.verifyLoggedUser,function(request,response){
  var token = request.body.token || request.query.token || request.headers['x-access-token'];
  var decoded = jwt.decode(token);
  User.findOne({"username":decoded.data.username}, {"orders.orderId": "1"}).populate({path:"orders.orderId",select:"product",populate:{path:"product.productId",select:["bname","image"]}}).exec(function (err, result) {
    if(err)
    response.json(err);
    else {
      var x= async.each(result.orders,function(data,callback) {
        console.log(data);
        var y = async.each(data.orderId.product, function (b,callback) {
          console.log(b);
          b.productId.image = b.productId.image[0];
          callback("success");
          console.log(b);

        },function(res){
          callback(res);
        });
        return data;
      },function(res){
        if(res==="success")
        response.json(result);
      });
    }
  });
});
router.post('/f',function(request,response){
  var date = new Date();
  date.setDate(date.getDate() + 6);
  response.json(dateformat(date,"dd:mm:yy"));

});

router.get('/logout',Verify.verifyLoggedUser,function(request, response){
  var token = request.body.token || request.query.token || request.headers['x-access-token'];
  jwt.verify(token, config.secretKey, function(err, decoded){
    if (err) {
      response.json(err);
    }
    else
    {
      decoded.data.logged = false;
      console.log(decoded.data);
      User.findByIdAndUpdate(decoded.data._id,{$set :{"logged":false}},
      { new : true},function(error,new_data){
        if(error)
        response.json(error);
        else
        {
          console.log(new_data);
          request.logout();
          response.status(200).json({
            status: 'Bye!'
          });
        }
      });
    }
  });
});
//====================================================================================
module.exports = router;
