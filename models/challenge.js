var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const Tournament = mongoose.model('Tournament');

const ChallengeStandingSchema = new Schema({
    player: {
        type: String,
        ref: 'Player'
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
    },
    numMatches: {
        type: Number,
        required: true
    }
});

var challengeSchema = new Schema({
    _id: { // automatically created
        type: String,
        required: true
    },
    options: {
        matchPoints: {
            type: Number,
            required: true,
            default: 1
        },
        winPoints: {
            type: String,
            enum: ['opponent', 'difference'],
            default: 'opponent'
        },
        lossPoints: {
            type: String,
            enum: ['own', 'difference'],
            default: 'own'
        }
    },
    lineUp: [
        ChallengeStandingSchema
    ],
    matches: [{
        type: Schema.Types.ObjectId,
        ref: 'Match'
    }],
    standings: [
        ChallengeStandingSchema
    ]
}, {
    discriminatorKey: 'kind'
});

Tournament.discriminator('Challenge', challengeSchema);