/**
 * Created by vn_shetty on 29/4/17.
 */
var express = require('express');
var router = express.Router();
var Wall = require('../models/wallpaper');
var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require('path');
var fs = require('fs');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : false}));

router.get('/',function(request,response){
    var link="../public/html/addWallpaper.html";
    link = path.join(__dirname,link);
    console.log(link+"-"+fs.existsSync(link));
    var stream=fs.createReadStream(link);
    stream.pipe(response);
});

router.post('/',function(request,response){

    Wall.find({},function(err,data){
        if(err)
            response.json(err);
        else {
            var s = _.countBy(data, function (num) {
                return 'count';
            });
            console.log(s.count);
            var x = Math.ceil(Math.random() * s.count);
            console.log(x-1);
            response.json(data[x-1]);
        }
    });

});
router.post('/add',function(request,response){
    console.log(request.body);
    Wall.create({},function(err,data){
        var j ={name:request.files.im.name,"data":request.files.im.data.toString('base64')};
        data.image.push(j);
        data.save(function(err,result){
           if(err)
               response.json(err);
           else
               response.json(result);
        });
    });
});
module.exports = router;