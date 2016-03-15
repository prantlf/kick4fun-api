var express = require('express');
var fileUtils = require('../utils/fileUtils');

var router = express.Router();

router.get('/', function (reg, res, next) {
    var players = JSON.parse(fileUtils.getAllPlayers());
    var fragments = reg.baseUrl.split('/');
    var tournament = fragments[fragments.length-2];
    var files = fileUtils.getAllTournamentFiles();
    var participantIds = [];
    files.forEach(function (file) {
        if (participantIds.length === 0) {
            var tournamentId = fileUtils.getTournamentIdFromFile(file);
            if (tournamentId === tournament) {
                var obj = fileUtils.getObjFromFile(file);
                participantIds = obj.participants;
                return false;
            }
        }
    });
    var participants = [];
    players.forEach(function (player) {
        if (participantIds.indexOf(player.id) >= 0) {
            participants.push(player);
        }
    });
    res.send(participants);
});

module.exports = router;
