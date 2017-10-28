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

router.post('/set',Verify.verifyLoggedUser,Verify.verifyAdmin,function(result,response){
  Boot.update({},{"status":"none"},{"multi":true},function(err,data){
    if(err)
    response.json(err);
    else
    response.json(data);
  });
});


router.post('/',function(request,response){
  var x;
  console.log(request.body.offset);
  if(request.body.offset!=undefined)
  x=request.body.offset;
  else
  x=0;
  console.log("offset:"+x);
  var query;
  if(request.body.offset!=undefined)
  query = Verify.trim_nulls(request.body.query);
  else
  query={};
  console.log(query);
  Boot.count({},function(err,count){
    Boot.find(query,{"_id":"0","bname":"1","coll":"1","brand":"1","saleprice":"1","image":"1","status":"1"}).exec(function(err,res){
      var y =_.uniq(_.pluck(_.flatten(res), "coll"));
      var w =_.uniq(_.pluck(_.flatten(res), "brand"));
      if(err)
      response.json(err);
      else {
        var s = _.countBy(res,function(num){
          return 'count';
        });
        var p = Math.ceil(s.count/10);
        res=_.sortBy(res,'status');
        console.log(res);
        res = _.filter(res,function(num){
          return res.indexOf(num)>=(10*x);
        });
        res = _.first(res,10);
        res=_.shuffle(res);
        for(var e in res)
        {
          res[e].image= _.first(res[e].image,1);
        }
        var z = {"total":count,"count":s.count,"pages":p,"collection": y, "brand": w, "data": res};
        response.json(z);
      }
    });
  });
});

router.post('/landing',function(request,response){
  var query = Verify.trim_nulls(request.body);
  Boot.findOne(query,{"bname":"1","description":"1","coll":"1","brand":"1","saleprice":"1","status":"1","image":"1","comments":"1"}).populate('comments.postedBy',{"_id":"1","username":"1"}).exec(function (err,res){
    if(err)
    response.json(err);
    else
    {
      var s = _.countBy(res.comments,function(num){
        return 'count';
      });
      var sum=0;
      var a = _.map(res.comments,function(num){
        return sum+= num.rating;
      });
      console.log(a/s.count);
      var z ={"averagerating":(a/s.count),"result":res};
      response.json(z);
    }
  });
});


module.exports= router;
