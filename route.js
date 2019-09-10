const express = require('express');
const route = express();
const db = require('./db');

route.use('/api', require('./api/login_api'));
route.use('/api/council', require('./api/council_api'));
route.use('/bank', require('./api/bank_api'));
route.use('/fabric', require('./api/fabric_api'));

module.exports = route;