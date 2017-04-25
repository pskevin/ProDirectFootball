var twilio = require('twilio');
var client = new twilio.RestClient('AC7f3c18f7892caa2aaee44f474017e2c8','6ff1819b8dc09ebd338d35aafde0a76c');
client.sms.messages.create({
    to:'+919820717713',
    from:'+12053796263',
    body:'Sup Bitch!!!'
},function(error, message) {
    if (!error) {
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
      console.log('Message sent on:');
        console.log(message.dateCreated);
    } else {
        console.log('Oops! There was an error.'+err);
    }
});
