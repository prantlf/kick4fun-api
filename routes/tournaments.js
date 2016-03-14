var express = require('express');
var fs = require('fs');
var path = require('path');

var router = express.Router();

/* GET all tournaments listing. */
router.get('/', function (req, res, next) {
    var files = fs.readdirSync(path.join(__dirname, '../data'));
    var tournaments = [];
    files.forEach(function (file) {
        if (file.indexOf('tournament-') == 0) {
            var data = fs.readFileSync(path.join(__dirname, '../data/', file));
            var obj = JSON.parse(data);
            var tournament = {};
            tournament.id = file.replace('tournament-', '').replace('.json', '');
            tournament.name = obj.name;
            tournament.type = obj.type;
            tournament.status = obj.status;
            tournaments.push(tournament);
        }
    });
    res.send(tournaments);
});

router.get('/*/participants', function (reg, res, next) {
    var data = fs.readFileSync(path.join(__dirname, '../data/players.json'));
    var players = JSON.parse(data);
    var url = reg.url;
    while (url.charAt(0) === '/') {
        url = url.substr(1);
    }
    var tournament = url.substr(0, url.indexOf('/'));
    var files = fs.readdirSync(path.join(__dirname, '../data'));
    var participantIds = [];
    files.forEach(function (file) {
        if (participantIds.length === 0 && file.indexOf('tournament-') == 0) {
            var tournamentId = file.substr('tournament-'.length, file.length - 'tournament-'.length - '.json'.length);
            if (tournamentId === tournament) {
                var data = fs.readFileSync(path.join(__dirname, '../data/', file));
                var obj = JSON.parse(data);
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
