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

module.exports = router;
