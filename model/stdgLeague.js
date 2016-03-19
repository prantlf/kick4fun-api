var mongoose = require('mongoose');

const StandingLeagueSchema = new mongoose.Schema({
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
        },
        rank: {
            type: Number,
            required: true
        }
    }]
});

StandingLeagueSchema
    .virtual('goalsDiff')
    .get(function () {
        return this.goalsScored - this.goalsShipped;
    })
;

mongoose.model('StandingLeague', StandingLeagueSchema);

