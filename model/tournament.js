var mongoose = require('mongoose');
var utils = require('../utils/utils');

const TournamentSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'league',
        enum: ['league', 'challenge']
    },
    id: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'planned',
        enum: ['planned', 'progress', 'completed']
    },
    participants: [String]
});

TournamentSchema.pre('save', function (next) {
    this.id = utils.guid();
    next();
});

mongoose.model('Tournament', TournamentSchema);