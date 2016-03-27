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

const LeagueSchema = new Schema({
    _id: { // automatically created
        type: String,
        required: true
    },
    options: {},
    standings: [
        LeagueStandingSchema
    ]
}, {
    discriminatorKey: 'kind'
});

/*
 * _id validation
 */

LeagueSchema.path('_id').validate(function (_id, respond) {
    respond(!this.isNew || /^[a-zA-Z0-9_]+$/.test(_id));
}, '_id must consist of alpha-numerical characters and _');

LeagueSchema.path('_id').validate(function (_id, respond) {
    respond(this.isNew || !this.isModified('_id'));
}, '_id cannot be changed');

LeagueSchema.path('_id').validate(function (_id, respond) {
    if (this.isNew) {
        Tournament.find({_id: _id, _organizer: this._organizer}).exec(function (error, tournaments) {
            respond(error || tournaments.length == 0);
        })
    } else {
        respond(true);
    }
}, '_id must be unique');

Tournament.discriminator('League', LeagueSchema);