var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const Tournament = mongoose.model('Tournament');

const LeagueStandingSchema = new Schema({
    player: {
        type: String,
        ref: 'Player'
    },
    score: {
        type: Number,
        required: true
    },
    wins: {
        type: Number,
        required: true
    },
    draws: {
        type: Number,
        required: true
    },
    losses: {
        type: Number,
        required: true
    },
    goalsScored: {
        type: Number,
        required: true
    },
    goalsShipped: {
        type: Number,
        required: true
    }
});

const leagueSchema = new Schema({
    _id: { // automatically created
        type: String,
        required: true
    },
    options: {},
    _matches: [{
        type: Schema.Types.ObjectId,
        ref: 'Match'
    }],
    standings: [
        LeagueStandingSchema
    ]
}, {
    discriminatorKey: 'kind'
});

Tournament.discriminator('League', leagueSchema);