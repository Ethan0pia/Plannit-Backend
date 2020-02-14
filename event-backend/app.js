var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var usersRouter = require('./routes/events');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(
  `mongodb://${process.env.EVENT_DB_SERVER || 'localhost'}:27017/events`,
  { useNewUrlParser: true }
);

var db = mongoose.connection;

db.on('error', function(err) {
  console.log('connection fail');
  console.error(err);
});

db.on('open', () => {
  console.log('connection success');
});

const uri = `/api/v${process.env.npm_package_version}/events`;

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(uri, usersRouter);

module.exports = app;
