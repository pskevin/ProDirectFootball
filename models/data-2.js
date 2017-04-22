var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var CommentSchema = new Schema(
  {
    rating :
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
    }
  },
  {
    timestamps : true
  }
);
var dataSchema = new Schema(
  {
    username:
    {
      type : String,
      required : true,
      unique : true
    },
    password: String,
    id :
    {
      type : String,
      //required : true,
      unique : true
    },
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
      },
      //required: true
    },
    admin:   {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps : true
  }
);
dataSchema.plugin(passportLocalMongoose);
var Pro = mongoose.model('prodirect',dataSchema);
module.exports=Pro
