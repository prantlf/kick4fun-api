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
    var player = request.body;
    Organizer.findOne({_id: player.organizer}, function (error, organizer) {
        if (error) {
            next(error);
        } else {
            var newPlayer = new Player({
                _id: player.name,
                fullName: player.fullName || '',
                nickName: player.nickName || '',
                _organizer: organizer
            });
            newPlayer.save(function (error, player) {
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
    Player.findOneAndUpdate({'_id': id}, request.body, {upsert: true}, function (error) {
        if (error) {
            next(new Error(error));
        } else {
            response.send('ok');
        }
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

module.exports = router;
