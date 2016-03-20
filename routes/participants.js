var express = require('express');
var utils = require('../utils');

var router = express.Router();

router.get('/api/tournaments/:tournamentId/participants', function (request, response, next) {
    /*
    var tournamentId = utils.getFragment(reg.baseUrl, '/', -2);
    var fileName = 'tournament-' + tournamentId + '.json';
    if (!fileUtils.fileExists(fileName)) {
        var error = new Error('Tournament with ID ' + tournamentId + ' does not exist.');
        error.status = 404;
        next(error);
    } else {
        var obj = fileUtils.getObjFromFile(fileName);
        var participantIds = obj.participants;
        */
    var tid = request.params.tournamentId;
        var participants = [];
    /*
        var players = fileUtils.getObjFromFile('players.json');
        players.forEach(function (player) {
            if (participantIds.indexOf(player.id) >= 0) {
                participants.push(player);
            }
        });
        */
        response.send(participants);
    //}
});

module.exports = router;
