var express = require('express');
var mongoose = require('mongoose');

const Tournament = mongoose.model('Tournament');
const Organizer = mongoose.model('Organizer');
const League = mongoose.model('League');
const Challenge = mongoose.model('Challenge');

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

router.post('/api/tournaments', function (request, response, next) {
    var data = request.body;
    Organizer.findOne({_id: data.organizer}, function (error, organizer) {
            if (error) {
                next(error);
            } else if (organizer == null) {
                next(new Error("Organizer does not exist"));
            } else {
                var tournament = null;
                var initData = {
                    _id: data.organizer + '_' + data.name,
                    name: data.name,
                    longName: data.longName,
                    description: data.description || '',
                    _organizer: data.organizer,
                    type: data.type
                };
                if (data.type == 'league') {
                    tournament = new League(initData);
                } else if (data.type == 'challenge') {
                    tournament = new Challenge(initData);
                } else {
                    next(new Error("Tournament type ' + data.type + ' does not exist"));
                }
                tournament.save(function (error, tournament) {
                    if (error) {
                        next(new Error(error));
                    } else {
                        response.send(tournament);
                    }
                });
            }
        }
    );
});

router.put('/api/tournaments/:id', function (request, response, next) {
    var id = request.params.id;
    var data = request.body;
    Tournament.findById(id, function (error, tournament) {
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
    });
});

router.delete('/api/tournaments/:id', function (request, response, next) {
    var tournamentId = request.params.id;
    Tournament.findOneAndRemove({'_id': tournamentId}, function (error) {
        if (error) {
            next(new Error(error));
        } else {
            response.send('ok');
        }
    })
});

router.put('/api/organizers/:id/tournaments/:name', function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    var data = request.body;
    Tournament.findOne({'_organizer': organizerId, 'name': tournamentName}, function (error, tournament) {
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
    });
});

router.delete('/api/organizers/:id/tournaments/:name', function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Player.findOneAndRemove({'_organizer': organizerId, 'name': tournamentName}, function (error) {
        if (error) {
            next(new Error(error));
        } else {
            response.send('ok');
        }
    })
});

module.exports = router;
