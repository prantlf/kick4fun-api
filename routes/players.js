var express = require('express');
var mongoose = require('mongoose');
var utils = require('../utils/utils');

const Player = mongoose.model('Player');

var router = express.Router();

router.get('/', function (req, res, next) {
    Player.find(function (err, players) {
        if (!err) {
            res.send(players);
        } else {
            next(new Error(err));
        }
    });
});

router.post('/', function (reg, res, next) {
    var player = reg.body;
    //var ok = verifyMatch(match);
    var newPlayer = new Player({
        name: player.name,
        fullName: player.fullName || '',
        nickName: player.nickName || '',
        organization: player.organization
    });
    newPlayer.save(function (err, player) {
        if (err) {
            res.send(err);
        } else {
            res.send('ok');
        }
    });
});

router.delete('/*/', function(reg, res, next) {
    var playerName = utils.getFragment(reg.originalUrl, '/', -1);
    Player.findOneAndRemove({'name': playerName}, function(respond) {
        respond(true);
    })
});

router.put('/', function (reg, res, next) {
    var player = reg.body;
    Player.findOneAndUpdate({'name': req.name}, req.newData, {upsert: true}, function () {

    });
});

module.exports = router;
