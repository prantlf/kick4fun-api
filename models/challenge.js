var mongoose = require('mongoose');

require('./tournament.js');

const ChallengeSchema = new mongoose.Schema({
    tournament: TournamentSchema,
    type: {
        type: String,
        default: 'start',
        enum: [
            'start',    // standings at beginning of challenge
            'current'   // current standings
        ]
    },
    standings: [{
        player: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true
        },
        fineScore: {
            type: Number,
            required: true
        },
        grade: {
            type: Number,
            required: true
        }
    }]
});

mongoose.model('Challenge', ChallengeSchema, 'Tournament');

