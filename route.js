const express = require('express');
const session = require('express-session');
const route = express();
const db = require('./db');
const cors = require('cors');

// CORS 설정
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

route.use(cors(corsOptions));
route.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

route.use('/api', require('./api/login_api'));
route.use('/api', require('./api/council_api'));
route.use('/api/bank', require('./api/bank_api'));
route.use('/fabric', require('./api/fabric_api'));

module.exports = route;
