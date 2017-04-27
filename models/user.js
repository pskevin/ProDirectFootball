var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var orderHistory = new Schema({
  orderId:
  {
    type : String

  },
  bootId :
  {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'boots'
  }
});
var dataSchema = new Schema(
  {
    username: String,
    password: String,
    Fname :
    {
      type : String
    },
    Mname :
    {
      type : String
    },
    Lname :
    {
      type : String
    },
    email:{
      type: String
    },
    mobno:
    {
      type:String
    },
    address:
    {
      type: String
    },
    admin:
    {
      type: Boolean,
      default: false
    },
    verified :{
      type :Boolean,
      default : false
    },
    otp: Number,
    logged:{
      type :Boolean,
      default: false
    },
    orders : [orderHistory]
  },
  {
    timestamps : true
  }
);
dataSchema.plugin(passportLocalMongoose);
var Pro = mongoose.model('user',dataSchema);
module.exports=Pro;
