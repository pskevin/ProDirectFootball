var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
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
    }
  },
  {
    timestamps : true
  }
);
var dataSchema = new Schema(
  {
    id :
    {
      type : String,
      required : true,
      unique : true
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
    price :
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

var Datas = mongoose.model('data',dataSchema);
module.exports=Datas
