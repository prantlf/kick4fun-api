var express = require('express');

var router = express.Router();

router.get('/', function (reg, res, next) {
});

router.post('/', function (reg, res, next) {
    var match = reg.body;
    var ok = verifyMatch(match);
    res.send(match);
});

module.exports = router;

function verifyMatch(match) {
    return true;
}