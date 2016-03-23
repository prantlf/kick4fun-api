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
        } else if (organizer == null) {
            next(new Error("Organizer does not exist"));
        } else {
            var newPlayer = new Player({
                name: player.name,
                fullName: player.fullName || '',
                nickName: player.nickName || '',
                _organizer: organizer._id
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
    var player = request.body;
    Player.findOneAndUpdate({'name': id}, player, {upsert: true}, function (error) {
        if (error) {
            next(new Error(error));
        } else {
            response.send(player);
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
