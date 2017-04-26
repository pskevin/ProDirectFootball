var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
var passportLocalMongoose = require('passport-local-mongoose');
var Currency = mongoose.Types.Currency;
var productSchema = new Schema(
    {
        productId:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref : 'boot',
                required : true
            },
        quantity: Number,
        salecost : Currency,
        profit : Currency
    }
);
var orderSchema = new Schema(
  {
    userId:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'user',
      required : true
    },
    product : [productSchema]
  },
  {
    timestamps : true
  }
);
orderSchema.plugin(passportLocalMongoose);
var Pro = mongoose.model('order',orderSchema);
module.exports=Pro;
