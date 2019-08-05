const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const controller = require('./watingDataController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true}));

router.post('/login', controller.login);

module.exports = router;