var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

TournamentSchema = new Schema({
    _id: { // automatically created
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    longName: {
        type: String,
        required: true
    },
    _organizer: {
        type: String,
        ref: 'Organizer'
    },
    status: {
        type: String,
        default: 'planned',
        enum: [
            'planned',      // not yet set up completely
            'progress',     // with partial results
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

TournamentSchema.path('name').validate(function (name, respond) {
    const Tournament = mongoose.model('Tournament');
    Tournament.find({_organizer: this._organizer}).exec(function (error, tournament) {
        if (error) {
            respond(false);
        } else {
            for (var i = 0; i < tournaments.length; i++) {
                if (tournaments[i].name === name) {
                    respond(false);
                }
            }
            respond(true);
        }
    })
}, "name must be unique within the organization");

mongoose.model('Tournament', TournamentSchema);
