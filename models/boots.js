var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
var passportLocalMongoose = require('passport-local-mongoose');
var Currency = mongoose.Types.Currency;
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
    },
    postedBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
    },

  },
  {
    timestamps : true
  }
);

var bootSchema = new Schema(
  {
    image :
    {
      name : String,
      data : Buffer,
      encoding : String,
      mimetype : String
    },
    name :
    {
      type : String,
      required : true
    },
    marks :
    {
      type : Number,
      required : true
    },
    costprice :
    {
      type : Currency,
      required : true
    },
    saleprice :
    {
      type : Currency,
      required : true
    },
    comments : [CommentSchema]
  },
  {
    timestamps : true
  }
);
bootSchema.plugin(passportLocalMongoose);
var Pro = mongoose.model('prodirect',bootSchema);
module.exports=Pro
