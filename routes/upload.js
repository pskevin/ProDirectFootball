var express = require('express');
var http = require('http');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var fileUpload = require('express-fileupload');
var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();
var Schema = mongoose.Schema();
mongoose.connect('mongodb://127.0.0.1/gridFs');
var conn = mongoose.connection;
var path = require('path');
var gridfs = require('gridfs-stream');
gridfs.mongo = mongoose.mongo;
var fs = require('fs');
var upload = express.Router();
upload.use(bodyParser.json());
upload.route('/')
.post(function(request,response,next){
  var x =request.files.up;
  console.log(x);
  /*
  conn.on('error',console.error.bind(console,'Connection Error!'));
  conn.once('open',function(){
    console.log("connection open!");
    var gfs = gridfs(conn.db);
    var writeStream = gfs.createWriteStream({
      filename : "H.mp4"
    });
    fs.createReadStream(videoPath).pipe(writeStream);
    writeStream.on('close',function(file){
      console.log("Wrote file"+file.filename);
    });
  });*/
});
module.exports = upload;
