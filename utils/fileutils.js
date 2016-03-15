var fs = require('fs');
var path = require('path');

module.exports = {
    getJsonFromFile: function (file) {
        return fs.readFileSync(path.join(__dirname, '../data/', file));
    },
    getObjFromFile: function (file) {
        return JSON.parse(this.getJsonFromFile(file));
    },
    getTournamentIdFromFile: function (file) {
        return file.replace('tournament-', '').replace('.json', '');
    },
    getAllTournamentFiles: function () {
        var fileNames = [];
        var files = fs.readdirSync(path.join(__dirname, '../data'));
        files.forEach(function (file) {
            if (file.indexOf('tournament-') == 0) {
                fileNames.push(file);
            }
        });
        return fileNames;
    },
    getTournamentFileFromId: function (id) {
        var files = fs.readdirSync(path.join(__dirname, '../data'));
        var tournamentFile = null;
        files.forEach(function (file) {
            if (file = 'tournament-' + id + '.json') {
                tournamentFile = file;
                return false;
            }
        });
        return tournamentFile;

    }
};