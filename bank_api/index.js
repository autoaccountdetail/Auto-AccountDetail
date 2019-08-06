const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const controller = require('./BankApiController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true}));

router.post('/transactions', controller.update);

module.exports = router;