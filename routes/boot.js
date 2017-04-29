//-----------------------------------------------------------
var express = require('express');
var router =express();
var fs = require('fs');
var path = require('path');
var Boot = require('../models/boots');
var bodyParser = require('body-parser');
var mime=require('mime');
var _ = require('underscore');
var Verify = require('./verify');
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
                    response.json(data);
                }
            });
        }
    });

});

router.post('/set',function(result,response){
   Boot.update({},{"status":"none"},{"multi":true},function(err,data){
      if(err)
          response.json(err);
      else
          response.json(data);
   });

});


router.post('/',function(request,response){
    if(request.body.offset)
        var x=request.body.offset;
    else
        var x = Math.random();
    var query = Verify.trim_nulls(request.body.query);
            Boot.find(query,{"_id":"0","bname":"1","coll":"1","brand":"1","saleprice":"1","status":"1"}).select("image").exec(function(err,res){
                var y =_.uniq(_.pluck(_.flatten(res), "coll"));
                var w =_.uniq(_.pluck(_.flatten(res), "brand"));
                if(err)
                    response.json(err);
                else {

                    var s = _.countBy(res,function(num){
                        return 'count';
                    });
                    console.log(s);
                    res= _.filter(res,function(num){
                        if(res.indexOf(num)>=(20*x))
                           return num;
                    });
                    //console.log(s);
                    res = _.first(res,20);
                    for(var e in res)
                    {
                        res[e].image= _.first(res[e].image,1);
                    }
                    var p = Math.ceil(s.count/10);
                    var z = {"count":s.count,"pages":p,"collection": y, "brand": w, "data": res};
                    response.json(z);
                }
            });
});

router.post('/landing',function(request,response){
    var query = Verify.trim_nulls(request.body);
    Boot.findOne(query,{"bname":"1","description":"1","coll":"1","brand":"1","saleprice":"1","status":"1","image":"1"}).populate('postedBy').exec(function (err,res){
        if(err)
            response.json(err);
        else
        {
            response.json(res);
        }
    });
});


module.exports= router;
