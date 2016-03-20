var mongoose = require('mongoose');

TournamentSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'league',
        enum: ['league', 'challenge']
    },
    description: {
        type: String,
        required: true
    },
    organizer: {
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

mongoose.model('Tournament', TournamentSchema);
