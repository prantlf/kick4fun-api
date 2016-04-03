const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const Tournament = mongoose.model('Tournament');

const MatchDaySchema = require('./matchday');
const StandingSchema = require('./standing');

const LeagueSchema = new Schema({
    _id: { // automatically created
        type: String,
        required: true
    },
    options: {},
    matchDays: [
        MatchDaySchema
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