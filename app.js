var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var randomString = require('randomstring');
var session = require('express-session');
var request = require("request");
var parseString = require('xml2js').parseString;
var { Iamporter, IamporterError } = require('iamporter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html')
app.set('views', 'views')
app.engine('html', require('ejs').renderFile);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/elec') ;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("Mongo DB ON");
});

var iamporter = new Iamporter();

var user = mongoose.Schema({
    _id: String,
    email: String,
    pw: String,
    name: String,
    accessToken: String,
    token: String,
    cardNum:String,
    cardPassword:String,
    cardBirthday:String,
    cardExpiry:String
});

var history = mongoose.Schema({
    token:String,
    date:String,
    amount:String
});

var userModel = mongoose.model('userModel',user);
var historyModel = mongoose.model('historyModel',history);

require('./routes/auth')(app,randomString,userModel);
require('./routes/payphone')(app,request)
require('./routes/pay')(app, userModel ,historyModel , iamporter , randomString , IamporterError);
require('./routes/elecCar')(app,request,parseString);
require('./routes/routes')(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
