var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

TournamentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    longName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    _organizer: {
        type: String,
        ref: 'Organizer'
    },
    status: {
        type: String,
        default: 'planned',
        enum: [
            'build',        // not yet set up completely
            'ready',        // set up completely
            'progress',     // started & with partial results
            'completed',    // with complete results
            'archived'      // intermediate standings removed?
        ]
    },
    participants: [{
        type: String,
        ref: 'Player'
    }]
}, {
    timestamps: true,
    discriminatorKey: 'kind'
});

/*
 * _id validation
 */

TournamentSchema.path('_id').validate(function (_id, respond) {
    respond(!this.isNew || /^[a-zA-Z0-9_]+$/.test(_id));
}, '_id must consist of alpha-numerical characters and _');

TournamentSchema.path('_id').validate(function (_id, respond) {
    respond(this.isNew || !this.isModified('_id'));
}, '_id cannot be changed');

TournamentSchema.path('_id').validate(function (_id, respond) {
    const Organizer = mongoose.model('Organizer');
    if (this.isNew) {
        Organizer.find({_id: _id}).exec(function (error, organizers) {
            respond(error || organizers.length == 0);
        })
    } else {
        respond(true);
    }
}, '_id must be unique');

/*
 * _organizer validation
 */

TournamentSchema.path('_organizer').validate(function (_organizer, respond) {
    respond(this.isNew || !this.isModified('_organizer'));
}, '_organizer cannot be changed');

/*
 * name validation
 */

TournamentSchema.path('name').validate(function (name, respond) {
    respond(!this.isNew || /^[a-zA-Z0-9]+$/.test(name));
}, 'name must consist of alphanumerical characters');

TournamentSchema.path('name').validate(function (name, respond) {
    respond(this.isNew || !this.isModified('name'));
}, 'name cannot be changed');

TournamentSchema.path('name').validate(function (name, respond) {
    const Tournament = mongoose.model('Tournament');
    if (this.isNew) {
        Tournament.find({_organizer: this._organizer, name: name}).exec(function (error, tournaments) {
            respond(error || tournaments.length == 0);
        });
    } else {
        respond(true);
    }

}, "name already exists for given organizer");

/*
 * longName validation
 */

TournamentSchema.path('longName').validate(function (longName, respond) {
    const Tournament = mongoose.model('Tournament');
    Tournament.find({_organizer: this._organizer, longName: longName}).exec(function (error, tournaments) {
        respond(error || this.isNew ? tournaments.length == 0 : tournaments.length == 1);
    });
}, "name already exists for given organizer");

mongoose.model('Tournament', TournamentSchema);
