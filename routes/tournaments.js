var express = require('express');
var mongoose = require('mongoose');

const Tournament = mongoose.model('Tournament');

var router = express.Router();

router.get('/api/tournaments', function (request, response, next) {
    Tournament.find(function (error, tournaments) {
        if (error) {
            next(new Error(error));
        } else {
            response.send(tournaments);
        }
    });
});

router.delete('/api/tournaments/:tournamentName', function (request, response, next) {
    var playerName = request.params.tournamentName;
    Tournament.findOneAndRemove({'name': tournamentName}, function (error) {
        if (error) {
            next(new Error(error));
        } else {
            response.send('ok');
        }
    })
});

module.exports = router;
