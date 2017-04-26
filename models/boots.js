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
    comments : [CommentSchema]
  },
  {
    timestamps : true
  }
);
bootSchema.plugin(passportLocalMongoose);
var Pro = mongoose.model('boot',bootSchema);
module.exports=Pro;
