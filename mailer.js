var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var express = require('express');
//var mailgun = require('mailgun');
var app = express();
var router = express.Router();
router.get('/', handleSayHello); // handle the route at yourdomain.com/sayHello


function handleSayHello(req, res){
  console.console.log("in");
  var api_key = 'key-3817130671e1c1f13919a3469f5e1386';
  var domain = 'sandbox127c4a0962454b07a273d25721d8887d.mailgun.org';
  //var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
  console.log("dsf");
  var data = {
    from: 'ProDirect Customer services <postmaster@sandbox127c4a0962454b07a273d25721d8887d.mailgun.org>',
    to: 'akshatshetty2908@gmail.com',
    subject: 'Hello',
    text: 'Testing some Mailgun awesomness! Sup bitch mail from the rear end!'
  };

  mailgun.messages().send(data, function (error, body) {
    if(error)
    response.json(error);
    else
    console.log(body);
  });
  }
module.exports= router;
