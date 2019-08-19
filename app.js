var express = require('express');
var app = express();
var db = require('./db');

app.use('/api', require('./login_api'));
app.use('/api/council', require('./council_api'));
app.use('/bank', require('./bank_api'));

module.exports = app;