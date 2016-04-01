const mongoose = require('mongoose');
const League = mongoose.model('League');

exports.create = function(initialData) {
    return new League(initialData);
};

exports.prepare = function(league) {
    return 'League not yet implemented';
};

exports.start = function(league) {
    return 'League not yet implemented';
};