var express = require('express');
var mongoose = require('mongoose');

const Player = mongoose.model('Player');

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
    var newPlayer = new Player({
        name: player.name,
        fullName: player.fullName || '',
        nickName: player.nickName || '',
        organizer: player.organizer
    });
    newPlayer.save(function (error, player) {
        if (error) {
            next(new Error(error));
        } else {
            response.send(player);
        }
    });
});

router.put('/api/players/:playerName', function (request, response, next) {
    var name = request.params.playerName;
    Player.findOneAndUpdate({'name': name}, request.body, {upsert: true}, function (error) {
        if (error) {
            next(new Error(error));
        } else {
            response.send('ok');
        }
    });
});

router.delete('/api/players/:playerName', function (request, response, next) {
    var playerName = request.params.playerName;
    Player.findOneAndRemove({'name': playerName}, function (error) {
        if (error) {
            next(new Error(error));
        } else {
            response.send('ok');
        }
    })
});

module.exports = router;
