var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var imageSchema = new Schema({
    name: String,
    data: String
});
var objectSchema = mongoose.Schema({
    image :[imageSchema]
},
{
    timestamps:true
});
var Pro = mongoose.model('wallpaper',objectSchema);
module.exports=Pro;


