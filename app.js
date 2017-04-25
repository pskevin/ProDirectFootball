//========================IMPORTS=======================================
var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fileupload = require('express-fileupload');
var passport = require('passport');
var app = express();
var user = require('./routes/users');
var boot = require('./routes/boot');
var url = 'mongodb://localhost:27017/Prodirect';
var mongoose = require('mongoose'),
    assert = require('assert');
mongoose.connect(url);
var db = mongoose.connection;

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//====================================================================================
//===========================IMPLEMENTATION===========================================

db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function (){
    console.log('Connected to server Successfully');
});

app.use(favicon(path.join(__dirname,'/public/images/favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload());
app.all('*', function(req, res, next){
    console.log('req start: ',req.secure, req.hostname, req.url, app.get('port'));
    if (req.secure) {
        return next();
    }
    res.redirect('https://'+req.hostname+':'+app.get('secPort')+req.url);
});
app.use('/user',user);
app.use('/boot',boot);
// app.use('/mail',mail);
// app.use('/announcement.html',announcement);
// app.use(express.static(path.join(__dirname, 'PDF')));

//====================================================================================
//===========================ERROR HANDLING===========================================
// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//====================================================================================
//=========================FUNCTIONS==================================================
function onpdfRequest(request,response,next) {
    var link = request.url.toString();
    console.log("Request from user :" + request.url);
    if (path.extname(link) == '.pdf') {
        link = './PDF' + link;
        var stream = fs.createReadStream(link);
        //response.setHeaders('Content-disposition','inline');
        //response.setHeaders('Content-type','application/pdf');
        // fs.readFile(link,function (err,data) {


        response.contentType("application/pdf");
        stream.pipe(response);
        //});
    }
    else
    {
        next();
    }

}
function onGetRequest(request,response)
{
    try
    {
        console.log("Request from user :"+request.url);
        var link;
        if(request.url=='/')
            link='/home-page.html';
        else
            link=(request.url).toString();
        console.log('Link:',link);
        if(path.extname(link)=='.html')
            link='./public/html'+link;
        link = path.normalize(link);
        console.log(link+"-"+fs.existsSync(link));
        if(fs.existsSync(link))
        {
            if(path.extname(link)=='.html')
            {

                response.writeHead(200,{"Content-Type":"text/html"});
                var stream=fs.createReadStream(link);
                stream.pipe(response);
            }
            else if(path.extname(link)=='.jpg' || path.extname(link)=='.png')
            {
                var img = fs.readFileSync(link);
                response.writeHead(200, {'Content-Type': 'image/gif' });
                response.end(img, 'binary');
            }
            else if(path.extname(link)=='.css')
            {
                response.writeHead(200, {'Content-Type': 'text/css' });
                var stream = fs.createReadStream(link);
                stream.pipe(response);
            }
            else if(path.extname(link)=='.js')
            {
                response.writeHead(200, {'Content-Type':'text/javascript' });
                var stream = fs.createReadStream(link);
                stream.pipe(response);
            }
            else
            {
                response.statusCode=415;
                throw new Error(response.statusCode+":Unsupported media type!");
            }
        }
        else
        {
            response.statusCode=404;
            throw new Error(response.statusCode+":File not found!");
        }
        //next();
    }
    catch(error)
    {
        throw error;
    }
}

function auth (req, res, next) {

    if (!req.signedCookies.user) {
        var authHeader = req.headers.authorization;
        var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        if (user == 'admin' && pass == 'password') {
            res.cookie('user','admin',{signed: true});
            next(); // authorized
        } else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
    else {
        if (req.signedCookies.user === 'admin') {
            next();
        }
        else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
}
//====================================================================================
module.exports = app;
