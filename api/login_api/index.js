const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const controller = require('./LoginController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true}));

router.post('/login', controller.login);
router.post('/join', controller.join);

module.exports = router;