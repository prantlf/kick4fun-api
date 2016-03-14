var fs = require('fs');
var path = require('path');

function FileUtils () {}

FileUtils.getAllPlayers = function() {
    var players = { 'error': 'Could not read file.' };
    fs.readFileSync(path.join(__dirname, '../data/players.json'), 'utf-8', function (err, data) {
        players = data;
    });
    return players;
};