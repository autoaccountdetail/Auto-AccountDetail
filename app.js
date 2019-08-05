var express = require('express');
var app = express();
var db = require('./db');

app.use('/api', require('./wating_data'));

module.exports = app;