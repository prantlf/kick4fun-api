var express = require('express');
//var fileUtils = require('../utils/fileUtils');
var mongoose = require('mongoose');
require('../model/player');
const Player = mongoose.model('Player');

var router = express.Router();

router.get('/', function (req, res, next) {
    //res.send(fileUtils.getJsonFromFile('players.json'));
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
    //res.send(match);
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

router.put('/', function (reg, res, next) {
    var player = reg.body;
    Player.findOneAndUpdate({'name': req.name}, req.newData, {upsert: true}, function () {

    });
});

module.exports = router;
