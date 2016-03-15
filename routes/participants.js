var express = require('express');
var fileUtils = require('../utils/fileUtils');

var router = express.Router();

router.get('/', function (reg, res, next) {
    var players = fileUtils.getObjFromFile('players.json');
    var fragments = reg.baseUrl.split('/');
    var tournament = fragments[fragments.length - 2];
    var file = fileUtils.getTournamentFileFromId(tournament);
    var participantIds = [];
    if (file !== null) {
        var obj = fileUtils.getObjFromFile(file);
        participantIds = obj.participants;
    }
    var participants = [];
    players.forEach(function (player) {
        if (participantIds.indexOf(player.id) >= 0) {
            participants.push(player);
        }
    });
    res.send(participants);
});

module.exports = router;
