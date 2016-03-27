var express = require('express');
var mongoose = require('mongoose');

const Tournament = mongoose.model('Tournament');
const Player = mongoose.model('Player');

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

router.post('api/organizers/:id/tournaments/:name/participants', function (request, response, next) {
    var participantName = request.body.name;
    var options = request.body.options;
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Player.findOne({_organizer: organizerId, name: participantName}).exec(function (error, player) {
        if (error) {
            next(error);
        } else if (player == null) {
            next('Player does not exist for given Organizer');
        }
    });
    Tournament.findOne({_organizer: organizerId, name: tournamentName}).exec(function (error, tournament) {
        if (error) {
            next(error);
        } else if (tournament == null) {
            next('Tournament does not exist for given Organizer');
        } else if (tournament.participants.indexOf(participantName) >= 0) {
            next('Player is already participant of tournament')
        } else {
            tournament.participants.push(participantName);
        }
    });
});

//router.delete('api/organizers/:id/tournaments/:tname/participants/:pname')

module.exports = router;
