var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var usersRouter = require('./routes/userRoute');

var app = express();
mongoose.connect(
  `mongodb://${process.env.USER_DB_SERVER || 'localhost'}:27017/user`,
  { useNewUrlParser: true }
);

const userApi = `/api/v${process.env.npm_package_version}`;

var db = mongoose.connection;
db.on('error', function(err) {
  console.log('connection fail');
});
db.on('open', function(err) {
  console.log('connection sucess');
});

app.use(logger('dev'));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.route(`${userApi}`);

app.use(`${userApi}/users`, usersRouter);

//global error handling
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized');
  } else {
    res.status(500).json({ errorType: err.name });
  }
});

module.exports = app;
