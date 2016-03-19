var mongoose = require('mongoose');

const ChallengeStandingSchema = new mongoose.Schema({
    tournament: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
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
        rank: {
            type: Number,
            required: true
        },
        grade: {
            type: Number,
            required: true
        }
    }]
});

mongoose.model('ChallengeStanding', ChallengeStandingSchema);

