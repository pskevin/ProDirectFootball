var express = require('express');
var router = express.Router();
var api_key = 'key-3817130671e1c1f13919a3469f5e1386';
var domain = 'sandbox127c4a0962454b07a273d25721d8887d.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
console.log("in!!");
//router.all('*', handleSayHello); // handle the route at yourdomain.com/sayHello
handleSayHello();

function handleSayHello(request,response,next){
  console.log("in");
  console.log("dsf");
  var data = {
    from: 'ProDirect Customer services <postmaster@sandbox127c4a0962454b07a273d25721d8887d.mailgun.org>',
    to: 'akshatshetty2908@gmail.com',
    subject: 'Hello',
      text: 'PRODIRECT CUSTOMER SERVICES.\nHello Akshat'+/*data.firstname+*/",\nYour transaction has been successfully completed. The cost of $1200"+/*+request.body.total+*/" has been deducted from your account.Thank you for using Prodirect Football.\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tThanking You,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tAkshat"
  };
  mailgun.messages().send(data, function (error, body) {
    if(error)
    response.json(error);
    else {
        console.log(body);
        //next();
    }
  });
  }
module.exports= router;
