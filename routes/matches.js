var express = require('express');

var router = express.Router();

router.get('/api/matches', function (reg, res, next) {
});

router.get('/api/tournaments/:id/matches', function (reg, res, next) {
});

router.get('/api/organizers/:id/tournaments/:name', function (reg, res, next) {
});

router.post('/api/matches', function (request, response, next) {
});

router.post('/api/tournaments/:id/matches', function (request, response, next) {
});

router.post('/api/organizers/:id/tournaments/:name/matches', function (request, response, next) {
});

router.delete('/api/matches/:id', function (request, response, next) {
});

router.delete('/api/tournaments/:id/matches/:num', function (request, response, next) {
});

router.delete('/api/organizers/:id/tournaments/:name/matches/:num', function (request, response, next) {
});

module.exports = router;

function verifyMatch(match) {
    return true;
}