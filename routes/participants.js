var express = require('express');
var mongoose = require('mongoose');

const Tournament = mongoose.model('Tournament');

var router = express.Router();

router.get('api/organizers/:id/tournaments/:name/participants', function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Tournament.find({_organizer: organizerId, name: tournamentName}, function (error, tournament) {
        if (error) {
            next(error);
        } else if (tournament == null) {
            next(new Error('Tournament does not exist'));
        } else {
            response.send(tournament.participants);
        }
    });
});

//router.post('api/organizers/:id/tournaments/:name/participants')

//router.delete('api/organizers/:id/tournaments/:tname/participants/:pname')

module.exports = router;
