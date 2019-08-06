var express = require('express');
var app = express();
var db = require('./db');

app.use('/api', require('./wating_data'));
app.use('/bank', require('./bank_api'));

module.exports = app;