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

router.get('/api/organizers/:id/tournaments', function (request, response, next) {
    var organizerId = request.params.id;
    Tournament.find({_organizer: organizerId}, function (error, tournaments) {
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
});

router.put('/api/organizers/:id/tournaments/:name', function (request, response, next) {
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
});

router.delete('/api/organizers/:id/tournaments/:name', function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Tournament.findOneAndRemove({'_organizer': organizerId, 'name': tournamentName}, function (error) {
        if (error) {
            next(new Error(error));
        } else {
            response.send('ok');
        }
    })
});

router.put('/api/organizers/:id/tournaments/:name/prepare', function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Tournament.findOne({'_organizer': organizerId, 'name': tournamentName}, function (error, tournament) {
        var ready = false;
        if (error) {
            next(new Error(error));
        } else if (tournament.status != 'build') {
            next(new Error('Tournament is not in build status'));
        } else if (tournament.kind == 'Challenge') {
            tournament.lineUp.sort(compareChallenge);
            var ctr = 0, levels = 0;
            while (ctr < tournament.participants.length) {
                levels += 1;
                ctr += levels;
            }
            ctr = 1;
            var countDown = 1;
            for (var i = 0; i < tournament.lineUp.length; ++i) {
                if (countDown == 0) {
                    ctr += 1;
                    countDown = ctr;
                    levels -= 1;
                }
                tournament.lineUp[i].level = levels;
                countDown--;
            }
            ready = true;
        } else if (tournament.kind == 'League') {
            // ....
            ready = true;
        } else {
            next(new Error('Tournament kind ' + data.kind + ' does not exist'));
        }
        if (ready) {
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
});

router.put('/api/organizers/:id/tournaments/:name/start', function (request, response, next) {
    var organizerId = request.params.id;
    var tournamentName = request.params.name;
    Tournament.findOne({'_organizer': organizerId, 'name': tournamentName}, function (error, tournament) {
        var progress = false;
        if (error) {
            next(new Error(error));
        } else if (tournament.status != 'ready') {
            next(new Error('Tournament is not in ready status'));
        } else if (tournament.kind == 'Challenge') {
            for (var i = 0; i < tournament.lineUp.length; ++i) {
                tournament.lineUp[i].score += tournament.options.basePoints;
                var clone = {};
                clone.player = tournament.lineUp[i].player;
                clone.score = tournament.lineUp[i].score;
                clone.fineScore = tournament.lineUp[i].fineScore;
                clone.level = tournament.lineUp[i].level;
                clone.numMatches = tournament.lineUp[i].numMatches;
                tournament.standings.push(clone);
            }
            progress = true;
        } else if (tournament.kind == 'League') {
            // ....
            progress = true;
        } else {
            next(new Error('Tournament kind ' + data.kind + ' does not exist'));
        }
        if (progress) {
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
});

function compareChallenge(a, b) {
    if (a.score < b.score) {
        return 1;
    } else if (a.score > b.score) {
        return -1;
    } else if (a.fineScore < b.fineScore) {
        return 1;
    } else if (a.fineScore > b.fineScore) {
        return -1;
    } else if (a.player > b.player) {
        return 1;
    } else {
        return -1;
    }
}

module.exports = router;
