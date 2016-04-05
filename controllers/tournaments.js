const fs = require('fs');
const mongoose = require('mongoose');

const Organizer = mongoose.model('Organizer');
const Tournament = mongoose.model('Tournament');

var tournamentTypes = {};
fs.readdirSync('./controllers/tournamentTypes').forEach(function (file) {
    var component = file.substr(0, file.length - 3);
    tournamentTypes[component] = require('../controllers/tournamentTypes/' + component);
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

exports.listOne = function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Tournament.find({_organizer: organizerId, 'name': tournamentName}, function (error, tournament) {
        if (error) {
            next(new Error(error));
        } else if (tournament == null) {
            next(new Error('Tournament does not exist'));
        } else {
            response.send(tournament);
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
                next({message: "Organizer does not exist", status: 400});
            } else {
                var tournament = null;
                var initialData = {
                    _id: organizerId + '_' + data.name,
                    name: data.name,
                    longName: data.longName,
                    description: data.description || '',
                    _organizer: organizerId
                };
                var kind = data.kind && data.kind.toLowerCase();
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
                    next({message: 'Tournament kind ' + data.kind + ' does not exist', status: 400});
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
            next(new Error(error));
        } else if (tournament == null) {
            next({message: "Organizer does not exist", status: 400});
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
    Tournament.findOneAndRemove({'_organizer': organizerId, 'name': tournamentName}, function (error, model) {
        if (error) {
            next(new Error(error));
        } else if (!model) {
            next({message: 'Player does not exist', status: 400});
        } else {
            response.sendStatus(204);
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
            next(new Error(error));
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
            next(new Error(error));
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

exports.finish = function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Tournament.findOne({'_organizer': organizerId, 'name': tournamentName}, function (error, tournament) {
        if (!error) {
            var kind = tournament.kind.toLowerCase();
            if (tournament.status != 'progress') {
                error = 'Tournament is not in progress status';
            } else if (tournamentTypes[kind]) {
                error = tournamentTypes[kind].finish(tournament);
            } else {
                error = 'Tournament kind ' + tournament.kind + ' does not exist';
            }
        }
        if (error) {
            next(new Error(error));
        } else {
            tournament.status = 'completed';
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

exports.archive = function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Tournament.findOne({'_organizer': organizerId, 'name': tournamentName}, function (error, tournament) {
        if (!error) {
            var kind = tournament.kind.toLowerCase();
            if (tournament.status != 'completed') {
                error = 'Tournament is not in completed status';
            } else if (tournamentTypes[kind]) {
                error = tournamentTypes[kind].archive(tournament);
            } else {
                error = 'Tournament kind ' + tournament.kind + ' does not exist';
            }
        }
        if (error) {
            next(new Error(error));
        } else {
            tournament.status = 'archived';
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

