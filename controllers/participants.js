const fs = require('fs');
const mongoose = require('mongoose');

const Tournament = mongoose.model('Tournament');
const Player = mongoose.model('Player');

var tournamentTypes = {};
fs.readdirSync('./controllers/tournamentTypes').forEach(function (file) {
    var component = file.substr(0, file.length - 3);
    tournamentTypes[component] = require('../controllers/tournamentTypes/' + component);
});

exports.list = function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Tournament.findOne({_organizer: organizerId, name: tournamentName}, function (error, tournament) {
        if (error) {
            next(error);
        } else if (tournament == null) {
            next({message: 'Tournament does not exist', status: 400});
        } else {
            response.send(tournament.participants || []);
        }
    });
};

exports.add = function (request, response, next) {
    var participantName = request.body.name;
    var options = request.body.options || {};
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Player.findOne({_organizer: organizerId, name: participantName}).exec(function (error, player) {
        if (error) {
            next(error);
        } else if (player == null) {
            next(new Error('Player does not exist for given Organizer'));
        } else {
            Tournament.findOne({_organizer: organizerId, name: tournamentName}).exec(function (error, tournament) {
                if (!error) {
                    if (tournament == null) {
                        error = 'Tournament does not exist for given Organizer';
                    } else if (tournament.participants.indexOf(participantName) >= 0) {
                        error = 'Player is already participant of tournament';
                    } else {
                        var kind = tournament.kind.toLowerCase();
                        if (tournamentTypes[kind]) {
                            error = tournamentTypes[kind].addParticipant(tournament, participantName, options);
                        } else {
                            error = 'Tournament kind ' + tournament.kind + ' does not exist';
                        }
                    }
                }
                if (error) {
                    next({message: error, status: 400});
                } else {
                    tournament.save(function (error, tournament) {
                        if (error) {
                            next(new Error(error));
                        } else {
                            response.send(tournament);
                        }
                    });
                }
            });
        }
    });
};

exports.remove = function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.tname;
    var participantName = request.params.pname;
    Tournament.findOne({_organizer: organizerId, name: tournamentName}).exec(function (error, tournament) {
        if (!error) {
            if (tournament == null) {
                error = 'Tournament does not exist for given Organizer';
            } else if (tournament.participants.indexOf(participantName) < 0) {
                error = 'Player is not participant of tournament';
            } else {
                var kind = tournament.kind.toLowerCase();
                if (tournamentTypes[kind]) {
                    error = tournamentTypes[kind].removeParticipant(tournament, participantName, options);
                } else {
                    error = 'Tournament kind ' + tournament.kind + ' does not exist';
                }
            }
        }
        if (error) {
            next({message: error, status: 400});
        } else {
            tournament.save(function (error, tournament) {
                if (error) {
                    next(new Error(error));
                } else {
                    response.send(tournament);
                }
            });
        }
    });
};