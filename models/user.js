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
      type:String,
      unique:true,
      validate:
      {
        validator: function(v)
        {
         return /^([0-9]{10}$)/.test(v);
        }
      }
    },
    // creditNo:
    // {
    //   type: Number,
    //   validate:
    //   {
    //     validator: function(v)
    //     {
    //      return /^([0-9]{16}$)/.test(v);
    //     }
    //   }
    // },
    // cvv:
    // {
    //   type: Number,
    //   validate:
    //   {
    //     validator: function(v)
    //     {
    //      return /^([0-9]{3}$)/.test(v);
    //     }
    //   },
    //   required :true
    // },
    address:
    {
      type: String
    },
    admin:
    {
      type: Boolean,
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
