var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var TournamentExports = require('./tournament');

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

TournamentExports.Tournament.discriminator('League', leagueSchema);