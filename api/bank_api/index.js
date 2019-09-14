const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const controller = require('./BankApiController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true}));

router.post('/transactions', controller.update);
router.post('/access_token', controller.issueToken);
router.post('/auth_code_url', controller.issueAuthCodeURL);
router.get('/auth_code', controller.saveAuthCode);

module.exports = router;