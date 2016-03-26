var express = require('express');
var mongoose = require('mongoose');

const Player = mongoose.model('Player');
const Organizer = mongoose.model('Organizer');

var router = express.Router();

router.get('/api/players', function (request, response, next) {
    Player.find(function (error, players) {
        if (error) {
            next(new Error(error));
        } else {
            response.send(players);
        }
    });
});

router.post('/api/players', function (request, response, next) {
    var data = request.body;
    Organizer.findOne({_id: data.organizer}, function (error, organizer) {
        if (error) {
            next(error);
        } else if (organizer == null) {
            next(new Error("Organizer does not exist"));
        } else {
            var player = new Player({
                _id: data.organizer + '_' + data.name,
                name: data.name,
                fullName: data.fullName || '',
                nickName: data.nickName || '',
                _organizer: data.organizer
            });
            player.save(function (error, player) {
                if (error) {
                    next(new Error(error));
                } else {
                    response.send(player);
                }
            });
        }
    });
});

router.put('/api/players/:id', function (request, response, next) {
    var id = request.params.id;
    var data = request.body;
    Player.findById(id, function (error, player) {
        player.name = data.name || player.name;
        player.nickName = data.nickName || player.nickName;
        player.fullName = data.fullName || player.fullName;
        player.save(function (error, player) {
            if (error) {
                next(new Error(error));
            } else {
                response.send(player);
            }
        });
    });
});

router.delete('/api/players/:id', function (request, response, next) {
    var id = request.params.id;
    Player.findOneAndRemove({'_id': id}, function (error) {
        if (error) {
            next(new Error(error));
        } else {
            response.send('ok');
        }
    })
});

router.put('/api/organizers/:id/players/:name', function (request, response, next) {
    var organizerId = request.params.id;
    var playerName = request.params.name;
    var data = request.body;
    Player.findOne({'_organizer': organizerId, 'name': playerName}, function (error, player) {
        player.name = data.name || player.name;
        player.nickName = data.nickName || player.nickName;
        player.fullName = data.fullName || player.fullName;
        player.save(function (error, player) {
            if (error) {
                next(new Error(error));
            } else {
                response.send(player);
            }
        });
    });
});

router.delete('/api/organizers/:id/players/:name', function (request, response, next) {
    var organizerId = request.params.id;
    var playerName = request.params.name;
    Player.findOneAndRemove({'_organizer': organizerId, 'name': playerName}, function (error) {
        if (error) {
            next(new Error(error));
        } else {
            response.send('ok');
        }
    })
});

module.exports = router;
