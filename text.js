var twilio = require('twilio');
var client = new twilio.RestClient('AC7f3c18f7892caa2aaee44f474017e2c8','6ff1819b8dc09ebd338d35aafde0a76c');
var x= Math.random()*(9999 - 1000)+1000;
x= parseInt(x);
var Fname = "Adhrit";
var text='PRODIRECT FOOTBALL.Hello '+Fname+", transaction successful. Amount deducted from account -"+x+" pounds.";

client.sms.messages.create({
    to:'+919820717713',
    from:'+12053796263',
    body: text
},function(error, message) {
    if (!error) {
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
      console.log('Message sent on:');
        console.log(message.dateCreated);
    } else {
        console.log(error);
    }
});
