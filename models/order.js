var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var orderSchema = new Schema(
  {
    userId:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'user',
      required : true
    },
    productId:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'boot',
      required : true
    },
    deliveryDate:
    {
      type : Date,
      required : true
    },
    status :
    {
      type : Boolean,
      default : false,
      required : true
    }
  },
  {
    timestamps : true
  }
);
orderSchema.plugin(passportLocalMongoose);
var Pro = mongoose.model('order',orderSchema);
module.exports=Pro;
