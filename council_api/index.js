const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const controller = require('./CouncilController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true}));

router.get('/comments', controller.searchComment);
router.put('/comments', controller.updateComment);


module.exports = router;