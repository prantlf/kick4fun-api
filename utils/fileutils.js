var fs = require('fs');
var path = require('path');
var _ = require('underscore');

module.exports = {

    fileExists: function (fileName) {
        var fileNames = fs.readdirSync(path.join(__dirname, '../data'));
        return _.contains(fileNames, fileName);
    },

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
    }
};