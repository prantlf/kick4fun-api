var mongoose = require('mongoose');
var utils = require('../utils/utils');

const TournamentSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'league',
        enum: ['league', 'challenge']
    },
    uniqueId: {
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'planned',
        enum: [
            'planned',      // not yet set up completely
            'progress',     // with partial results
            'completed',    // with complete results
            'archived'      // intermediate standings removed
        ]
    },
    participants: [String]
});

TournamentSchema
    .path('uniqueId')
    .validate(function (uniqueId) {
        return this.uniqueId != uniqueId;
    })

    .pre('save', function (next) {
        if (this.isNew) {
            this.uniqueId = utils.guid();
        }
        next();
    })
;

mongoose.model('Tournament', TournamentSchema);