const mongoose = require('mongoose');
const League = mongoose.model('League');

exports.create = function(initialData) {
    return new League(initialData);
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
exports.prepare = function(league) {
    return 'League not yet implemented';
};

exports.start = function(league) {
    return 'League not yet implemented';
};