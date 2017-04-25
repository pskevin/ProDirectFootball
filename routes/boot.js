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
    var link="/home/vn_shetty/Pictures/git/ProDirectFootball/public/html/upload.html";
    link = path.normalize(link);
    console.log(link+"-"+fs.existsSync(link));
    var stream=fs.createReadStream(link);
    stream.pipe(response);
});
router.post('/add',function(request,response){
    console.log(request.body);
    //console.log(request.files.file);
    Boot.create(request.body,function (err,data){
        if(err)
            console.log(err);
        else
        {
            data.image.push(request.files.thumb);
            data.image.push(request.files.left);
            data.image.push(request.files.over);
            data.image.push(request.files.right);
            data.save(function(err,result){
                if(err)
                    response.json(err);
                else
                {
                    console.log(data.image[0]);
                    request.files.thumb.mv(path.join(__dirname, '../public/images/' + data.bname+"-thumb.jpg"), function (err,entry) {
                        if (err)
                            return response.status(500).send(err);
                        else {
                            console.log(entry);
                            console.log(fs.existsSync(__dirname, '../public/images/' +data.bname+"-thumb.jpg"));
                            var x=fs.readFileSync(path.join(__dirname,'../public/images/' +data.bname+"-thumb.jpg"));
                            response.json(x.toString('base64'));
                        }
                    });

                }
            });

        }
    });

});
router.post('/',function(request,response){
    Boot.find({}).populate('postedBy').exec(function (err,data){
        if(err)
            response.json(err);
        else
        {
            response.json(data);
        }
    });
});
module.exports= router;
