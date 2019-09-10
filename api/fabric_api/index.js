const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const controller = require('./FabricController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true}));

router.get('/', controller.loadTransactionList);

module.exports = router;