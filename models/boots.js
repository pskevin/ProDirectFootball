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
      max : 5
    },
    remarks :
    {
      type : String
    },
    postedBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
    }
  },
  {
    timestamps : true
  }
);
var imageSchema = new Schema({
    name: String,
    data: String
});
var bootSchema = new Schema(
  {
    image :[imageSchema],
    bname :
    {
      type : String
    },
    brand:
    {
        type:String
    },
    coll:
    {
     type : String
    },
    description:
    {
        type:String
    },
    costprice :
    {
        type : Currency
    },
    saleprice :
    {
      type : Currency
    },
    comments : {
        type :[CommentSchema],
        required : false
    }
  },
  {
    timestamps : true
  }
);
bootSchema.plugin(passportLocalMongoose);
var Pro = mongoose.model('boot',bootSchema);
module.exports=Pro;
