const mongoose = require('mongoose');

const Tournament = mongoose.model('Tournament');
const Player = mongoose.model('Player');

exports.list = function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Tournament.find({_organizer: organizerId, name: tournamentName}, function (error, tournament) {
        if (error) {
            next(error);
        } else if (tournament == null) {
            next(new Error('Tournament does not exist'));
        } else {
            response.send(tournament.participants || []);
        }
    });
};

exports.create = function (request, response, next) {
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
                if (error) {
                    next(error);
                } else if (tournament == null) {
                    next(new Error('Tournament does not exist for given Organizer'));
                } else if (tournament.kind == 'League' && tournament.status != 'build') {
                    next(new Error('Tournament/League is not in build status'));
                } else if (tournament.kind == 'Challenge' && tournament.status != 'build' && tournament.status != 'progress') {
                    next(new Error('Tournament/Challenge is not in build or progress status'));
                } else if (tournament.participants.indexOf(participantName) >= 0) {
                    next(new Error('Player is already participant of tournament'));
                } else {
                    tournament.participants.push(participantName);
                    if (tournament.kind == 'Challenge') {
                        tournament.lineUp.push({
                            player: participantName,
                            score: options.score || 0,
                            fineScore: options.fineScore || (1-tournament.participants.length/100)
                        });
                    }
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

exports.delete = function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.tname;
    var participantName = request.params.pname;
    Tournament.findOne({_organizer: organizerId, name: tournamentName}).exec(function (error, tournament) {
        if (error) {
            next(error);
        } else if (tournament == null) {
            next(new Error('Tournament does not exist for given Organizer'));
        } else if (tournament.status != 'build') {
            next(new Error('Tournament is not in build status'));
        } else if (tournament.participants.indexOf(participantName) < 0) {
            next(new Error('Player is not participant of tournament'));
        } else {
            tournament.participants.remove(participantName);
            if (tournament.kind = 'Challenge') {
                for (var i = 0; i < tournament.lineUp.length; ++i) {
                    if (tournament.lineUp[i].player == participantName) {
                        tournament.lineUp.splice(i, 1);
                        break;
                    }
                }
            }
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