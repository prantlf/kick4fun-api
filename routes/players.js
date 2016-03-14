var express = require('express');
var fs = require('fs');
var path = require('path');

var router = express.Router();

/* GET all players listing. */
router.get('/', function (req, res, next) {
    var data = fs.readFileSync(path.join(__dirname, '../data/players.json'));
    res.send(data);
});

module.exports = router;
