//-----------------------------------------------------------
var express = require('express');
var router =express();
var fs = require('fs');
var path = require('path');
var Boot = require('../models/boots');
var bodyParser = require('body-parser');
var mime=require('mime');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : false}));

router.get('/',function(request,response){
    var link="../public/html/upload.html";
    link = path.join(__dirname,link);
    console.log(link+"-"+fs.existsSync(link));
    var stream=fs.createReadStream(link);
    stream.pipe(response);
});
router.post('/add',function(request,response){
    console.log(request.body);
    Boot.create(request.body,function (err,data){
        if(err)
            console.log(err);
        else
        {
            console.log(data);
            var bname =data.bname;
            var j ={name:bname+"-thumb","data":request.files.thumb.data.toString('base64')};
            data.image.push(j);
             j ={name:bname+"-left","data":request.files.left.data.toString('base64')};
             data.image.push(j);
            j ={name:bname+"-over","data":request.files.over.data.toString('base64')};
            data.image.push(j);
            j ={name:bname+"-right","data":request.files.right.data.toString('base64')};
            data.image.push(j);
            data.save(function(err,result){
                if(err)
                    response.json(err);
                else
                {
                    console.log(data.image[0]);
                    response.json(data.image[0]);
                }
            });
        }
    });

});

router.post('/',function(request,response){
    Boot.find({}).skip(20*request.body.offset).find(20).populate('postedBy').exec(function (err,data){
        if(err)
            response.json(err);
        else
        {
            response.json(data);
        }
    });
});
module.exports= router;
