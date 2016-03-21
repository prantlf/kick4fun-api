var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var TournamentExports = require('./tournament');

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

TournamentExports.Tournament.discriminator('Challenge', challengeSchema);