var express = require('express');
//var fileUtils = require('../utils/fileUtils');
const Player = mongoose.model('Player');

var router = express.Router();

router.get('/', function (req, res, next) {
    //res.send(fileUtils.getJsonFromFile('players.json'));
    var allPlayers = [];
    Player.find(function (err, players) {
        allPlayers = players;
    });
    res.send(allPlayers);
});

router.post('/', function (reg, res, next) {
    var player = reg.body;
    //var ok = verifyMatch(match);
    //res.send(match);
    var newPlayer = new Player({
        name: player.name,
        fullName: player.fullName || '',
        nickName: player.nickName || '',
        organisation: player.organisation
    });
    newPlayer.save(function (err, player) {
    });
});

module.exports = router;
