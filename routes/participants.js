var express = require('express');
var fileUtils = require('../utils/fileUtils');
var urlUtils = require('../utils/urlUtils');

var router = express.Router();

router.get('/', function (reg, res, next) {
    var players = fileUtils.getObjFromFile('players.json');
    var tournament = urlUtils.getInnerId(reg.baseUrl);
    var file = 'tournament-' + tournament + '.json';
    if (!fileUtils.fileExists(file)) {
        var error = new Error('Tournament with ID ' + tournament + ' does not exist.');
        error.status = 404;
        next(error);
    } else {
        var participantIds = [];
        var obj = fileUtils.getObjFromFile(file);
        participantIds = obj.participants;
        var participants = [];
        players.forEach(function (player) {
            if (participantIds.indexOf(player.id) >= 0) {
                participants.push(player);
            }
        });
        res.send(participants);
    }
});

module.exports = router;
