var mongoose = require('mongoose');

require('./tournament.js');

const ChallengeSchema = Tournament.discriminator('Challenge',
    new mongoose.Schema({
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
    })
);

//mongoose.model('Challenge', ChallengeSchema, 'Tournament');

