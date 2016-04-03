const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const Tournament = mongoose.model('Tournament');

const MatchSchema = require('./match');
const StandingSchema = require('./standing');

const ChallengeSchema = new Schema({
    _id: { // automatically created
        type: String,
        required: true
    },
    options: {
        basePoints: {
            type: Number,
            required: true,
            default: 20
        },
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
        StandingSchema
    ],
    matches: [
        MatchSchema
    ],
    standings: [
        StandingSchema
    ]
}, {
    discriminatorKey: 'kind'
});

/*
 * _id validation
 */

ChallengeSchema.path('_id').validate(function (_id, respond) {
    respond(!this.isNew || /^[a-zA-Z0-9_]+$/.test(_id));
}, '_id must consist of alpha-numerical characters and _');

ChallengeSchema.path('_id').validate(function (_id, respond) {
    respond(this.isNew || !this.isModified('_id'));
}, '_id cannot be changed');

ChallengeSchema.path('_id').validate(function (_id, respond) {
    if (this.isNew) {
        Tournament.find({_id: _id, _organizer: this._organizer}).exec(function (error, tournaments) {
            respond(error || tournaments.length == 0);
        })
    } else {
        respond(true);
    }
}, '_id must be unique');

Tournament.discriminator('Challenge', ChallengeSchema);