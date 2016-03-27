var express = require('express');

var router = express.Router();

router.get('/api/organizers/:id/tournaments/:name', function (reg, res, next) {
});

router.post('/api/organizers/:id/tournaments/:name/matches', function (request, response, next) {
});

router.delete('/api/organizers/:id/tournaments/:name/matches/:num', function (request, response, next) {
});

module.exports = router;

function verifyMatch(match) {
    return true;
}