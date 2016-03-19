var mongoose = require('mongoose');
var utils = require('../utils/utils');

const TournamentSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'league',
        enum: ['league', 'challenge']
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
        enum: [
            'planned',      // not yet set up completely
            'progress',     // with partial results
            'completed',    // with complete results
            'archived'      // ?? intermediate standings removed
        ]
    },
    participants: [String]
}, {
    timestamps: true
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