var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var orderHistory = new Schema({
  orderId:
  {
    type : String,

  },
  bootId :
  {
    type: mongoose.Schema.Types.ObjectId,
    ref : String
  }
});
var dataSchema = new Schema(
  {
    username:
    {
      type : String,
      required : true,
      unique : true
    },
    password: String,
    Fname :
    {
      type : String,
      //required : true
    },
    Mname :
    {
      type : String,
    //  required : true
    },
    Lname :
    {
      type : String,
    //  required : true
    },
    mobno:
    {
      type:String,
      unique:true,
      validate:
      {
        validator: function(v)
        {
         return /^([0-9]{10}$)/.test(v);
        }
      }
      //required: true
    },
    gender:
    {
      type: String,
      required :true
    },
    creditNo:
    {
      type: Number,
      validate:
      {
        validator: function(v)
        {
         return /^([0-9]{16}$)/.test(v);
        }
      },
      required :true
    },
    cvv:
    {
      type: Number,
      validate:
      {
        validator: function(v)
        {
         return /^([0-9]{3}$)/.test(v);
        }
      },
      required :true
    },
    address:
    {
      type: String,
      required :true
    },
    admin:
    {
      type: Boolean,
      default: false
    },
    orders : [orderHistory],
  },
  {
    timestamps : true
  }
);
dataSchema.plugin(passportLocalMongoose);
var Pro = mongoose.model('prodirect',dataSchema);
module.exports=Pro
