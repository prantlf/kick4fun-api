const fs = require('fs');
const _ = require('underscore');
const mongoose = require('mongoose');

const Tournament = mongoose.model('Tournament');

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
            next(new Error(error));
        }
        else if (tournament == null) {
            next(new Error('Tournament does not exist'));
        }
        else {
            response.send(tournament.matches || []);
        }
    });
};

exports.add = function (request, response, next) {
    var data = request.body;
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Tournament.findOne({_organizer: organizerId, name: tournamentName}).exec(function (error, tournament) {
        if (!error) {
            if (tournament == null) {
                error = 'Tournament does not exist for given Organizer';
            } else if (!data.team1 || !data.team2 || !data.result) {
                error = 'Match is not complete';
            } else if (!_.each(data.team1.concat(data.team2), function (player) {
                    return _.contains(tournament.participants, player);
                })) {
                error = 'Not all players are participants';
            } else if (data.result.length < 2) {
                error = 'Match result is not complete';
            } else {
                var kind = tournament.kind.toLowerCase();
                if (tournamentTypes[kind]) {
                    error = tournamentTypes[kind].addMatch(tournament, data);
                } else {
                    error = 'Tournament kind ' + tournament.kind + ' does not exist';
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
        }
    });
};

exports.update = function (request, response, next) {
    var data = request.body;
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    var matchNumber = request.params.num;
    Tournament.findOne({_organizer: organizerId, name: tournamentName}).exec(function (error, tournament) {
        if (!error) {
            if (tournament == null) {
                error = 'Tournament does not exist for given Organizer';
            } else {
                var kind = tournament.kind.toLowerCase();
                if (tournamentTypes[kind]) {
                    error = tournamentTypes[kind].updateMatch(tournament, matchNumber, data);
                } else {
                    error = 'Tournament kind ' + tournament.kind + ' does not exist';
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
        }
    });
};

exports.delete = function (request, response, next) {
    var data = request.body;
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    var matchNumber = request.params.num;
    Tournament.findOne({_organizer: organizerId, name: tournamentName}).exec(function (error, tournament) {
        if (!error) {
            if (tournament == null) {
                error = 'Tournament does not exist for given Organizer';
            } else {
                var kind = tournament.kind.toLowerCase();
                if (tournamentTypes[kind]) {
                    error = tournamentTypes[kind].deleteMatch(tournament, matchNumber, data);
                } else {
                    error = 'Tournament kind ' + tournament.kind + ' does not exist';
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
        }
    });
};
