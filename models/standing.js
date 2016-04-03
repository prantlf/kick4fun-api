const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const StandingSchema = new Schema({
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
    level: {
        type: Number,
        default: 0
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
