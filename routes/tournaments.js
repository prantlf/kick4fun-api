var express = require('express');
var fileUtils = require('../utils/fileUtils');

var router = express.Router();

/* GET all tournaments listing. */
router.get('/', function (req, res, next) {
    var files = fileUtils.getAllTournamentFiles();
    var tournaments = [];
    files.forEach(function (file) {
        var obj = fileUtils.getObjFromFile(file);
        var tournament = {};
        tournament.id = fileUtils.getTournamentIdFromFile(file);
        tournament.name = obj.name;
        tournament.type = obj.type;
        tournament.status = obj.status;
        tournaments.push(tournament);
    });
    res.send(tournaments);
});

router.get('/*/participants', function (reg, res, next) {
    var players = JSON.parse(fileUtils.getAllPlayers());
    var url = reg.url;
    while (url.charAt(0) === '/') {
        url = url.substr(1);
    }
    var tournament = url.substr(0, url.indexOf('/'));
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
