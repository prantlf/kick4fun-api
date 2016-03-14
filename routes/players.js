var express = require('express');
var fileUtils = require('../utils/fileUtils');

var router = express.Router();

/* GET all players listing. */
router.get('/', function (req, res, next) {
    res.send(fileUtils.getAllPlayers());
});

module.exports = router;
