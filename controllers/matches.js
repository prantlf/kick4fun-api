const fs = require('fs');
const mongoose = require('mongoose');

const Match = mongoose.model('Match');
const Tournament = mongoose.model('Tournament');

var tournamentTypes = {};
fs.readdirSync('./tournaments').forEach(function (file) {
    var component = file.substr(0, file.length - 3);
    tournamentTypes[component] = require('../tournaments/' + component);
});

exports.list = function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Match.find({_organizer: organizerId, name: tournamentName}, function (error, matches) {
        if (error) {
            next(error);
        } else {
            response.send(matches || []);
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
                next({message: 'Tournament does not exist for given Organizer', status: 400});
            } else {
                Match.find({_tournament: tournament._id}).exec(function (error, matches) {
                    if (!error) {
                        var match = new Match(data);
                        match._organizer = organizerId;
                        match._tournament = tournament._id;
                        match.number = matches.length;
                        match._id = organizerId + '_' + tournamentName + '_' + match.number;
                        var kind = tournament.kind.toLowerCase();
                        if (tournamentTypes[kind]) {
                            error = tournamentTypes[kind].addMatch(tournament, match);
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
                });
            }
        }
    });
};
