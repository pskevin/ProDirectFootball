var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
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
            ref: 'user'
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
                type : Number
            },
        status:String,
        saleprice :
            {
                type : Number
            },
        comments : {
            type :[CommentSchema],
            required : false,
            unique : false
        }
    },
    {
        timestamps : true
    }
);
bootSchema.plugin(passportLocalMongoose);
var Pro = mongoose.model('boot',bootSchema);
module.exports=Pro;
