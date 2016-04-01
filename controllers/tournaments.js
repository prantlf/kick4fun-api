const fs = require('fs');
const mongoose = require('mongoose');

const Organizer = mongoose.model('Organizer');
const Tournament = mongoose.model('Tournament');

var tournamentTypes = {};
fs.readdirSync('./tournaments').forEach(function (file) {
    var component = file.substr(0, file.length - 3);
    tournamentTypes[component] = require('../tournaments/' + component);
});

exports.listAll = function (request, response, next) {
    Tournament.find(function (error, tournaments) {
        if (error) {
            next(new Error(error));
        } else {
            response.send(tournaments);
        }
    });
};

exports.list = function (request, response, next) {
    var organizerId = request.params.id;
    Tournament.find({_organizer: organizerId}, function (error, tournaments) {
        if (error) {
            next(new Error(error));
        } else {
            response.send(tournaments);
        }
    });
};

exports.create = function (request, response, next) {
    var data = request.body;
    var organizerId = request.params.id;
    Organizer.findOne({_id: organizerId}, function (error, organizer) {
            if (error) {
                next(error);
            } else if (organizer == null) {
                next(new Error("Organizer does not exist"));
            } else {
                var tournament = null;
                var initialData = {
                    _id: organizerId + '_' + data.name,
                    name: data.name,
                    longName: data.longName,
                    description: data.description || '',
                    _organizer: organizerId
                };
                var kind = data.kind.toLowerCase();
                if (tournamentTypes[kind]) {
                    tournament = tournamentTypes[kind].create(initialData);
                }
                if (tournament) {
                    tournament.save(function (error, tournament) {
                        if (error) {
                            next(new Error(error));
                        } else {
                            response.send(tournament);
                        }
                    });
                } else {
                    next(new Error('Tournament kind ' + data.kind + ' does not exist'));
                }
            }
        }
    );
};

exports.update = function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    var data = request.body;
    Tournament.findOne({'_organizer': organizerId, 'name': tournamentName}, function (error, tournament) {
        if (error) {
            next(error);
        } else if (organizer == null) {
            next(new Error("Organizer does not exist"));
        } else {
            tournament.name = data.name || tournament.name;
            tournament.longName = data.longName || tournament.longName;
            tournament.description = data.description || tournament.description;
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

exports.delete = function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Tournament.findOneAndRemove({'_organizer': organizerId, 'name': tournamentName}, function (error) {
        if (error) {
            next(new Error(error));
        } else {
            response.send('ok');
        }
    })
};

exports.prepare = function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Tournament.findOne({'_organizer': organizerId, 'name': tournamentName}, function (error, tournament) {
        if (!error) {
            var kind = tournament.kind.toLowerCase();
            if (tournament.status != 'build') {
                error = 'Tournament is not in build status';
            } else if (tournamentTypes[kind]) {
                error = tournamentTypes[kind].prepare(tournament);
            } else {
                error = 'Tournament kind ' + tournament.kind + ' does not exist';
            }
        }
        if (error) {
            next(error);
        } else {
            tournament.status = 'ready';
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

exports.start = function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Tournament.findOne({'_organizer': organizerId, 'name': tournamentName}, function (error, tournament) {
        if (!error) {
            var kind = tournament.kind.toLowerCase();
            if (tournament.status != 'ready') {
                error = 'Tournament is not in ready status';
            } else if (tournamentTypes[kind]) {
                error = tournamentTypes[kind].start(tournament);
            } else {
                error = 'Tournament kind ' + tournament.kind + ' does not exist';
            }
        }
        if (error) {
            next(error);
        } else {
            tournament.status = 'progress';
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


