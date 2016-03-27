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

router.get('/api/organizer/:id/tournaments', function (request, response, next) {
    var organizerId = request.params.id;
    Tournament.find({_organizer: organizerId},function (error, tournaments) {
        if (error) {
            next(new Error(error));
        } else {
            response.send(tournaments);
        }
    });
});

router.post('/api/organizers/:id/tournaments', function (request, response, next) {
    var data = request.body;
    var organizerId = request.params.id;
    Organizer.findOne({_id: organizerId}, function (error, organizer) {
            if (error) {
                next(error);
            } else if (organizer == null) {
                next(new Error("Organizer does not exist"));
            } else {
                var tournament = null;
                var initData = {
                    _id: organizerId + '_' + data.name,
                    name: data.name,
                    longName: data.longName,
                    description: data.description || '',
                    _organizer: organizerId
                };
                if (data.kind == 'League') {
                    tournament = new League(initData);
                } else if (data.kind == 'Challenge') {
                    tournament = new Challenge(initData);
                } else {
                    next(new Error("Tournament kind ' + data.kind + ' does not exist"));
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

//router.put('/api/organizers/:id/tournaments/:name/prepare')

//router.put('/api/organizers/:id/tournaments/:name/start')

module.exports = router;
