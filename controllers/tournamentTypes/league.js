const mongoose = require('mongoose');
const League = mongoose.model('League');

exports.create = function (initialData) {
    return new League(initialData);
};

exports.prepare = function (league) {
    return 'League not yet implemented';
};

exports.start = function (league) {
    return 'League not yet implemented';
};

exports.finish = function (league) {
    return 'League not yet implemented';
};

exports.archive = function (league) {
    return 'League not yet implemented';
};

exports.addParticipant = function (league, name, options) {
    if (league.status != 'build') {
        return 'League is not in build or progress status';
    } else {
        league.participants.push(name);
    }
};

exports.removeParticipant = function (challenge, name) {
    if (challenge.status != 'build') {
        return 'League is not in build status';
    } else {
        challenge.participants.remove(name);
    }
};

exports.addMatch = function (league, data) {
    return 'Adding match not supported by League';
};

exports.updateMatch = function (league, num, data) {
    if (league.status != 'progress') {
        return 'League is not in progress status';
    } else {
        return 'Updating match not yet implemented';
    }
};

exports.deleteMatch = function (league, num) {
    return 'Deleting match not supported by League';
};

