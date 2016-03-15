var express = require('express');

var router = express.Router();

router.get('/', function (reg, res, next) {
});

router.post('/', function (reg, res, next) {
    res.send('posted');
});

module.exports = router;
