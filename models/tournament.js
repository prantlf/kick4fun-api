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
    description: {
        type: String,
        default: ''
    },
    _organizer: {
        type: String,
        ref: 'Organizer'
    },
    type: {
        type: String,
        default: 'liga',
        enum: [
            'liga',
            'challenge'
        ]
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

TournamentSchema.path('_id').validate(function (_id, respond) {
    respond(!this.isNew || /^[a-zA-Z0-9_]+$/.test(_id));
}, '_id must consist of alpha-numerical characters ans underscore');

TournamentSchema.path('_id').validate(function (_id, respond) {
    respond(this.isNew || !this.isModified('_id'));
}, '_id cannot be changed');

TournamentSchema.path('_id').validate(function (_id, respond) {
    const Organizer = mongoose.model('Organizer');
    if (this.isNew) {
        Organizer.find({_id: _id}).exec(function (error, organizers) {
            respond(!error && organizers.length == 0);
        })
    } else {
        respond(true);
    }
}, '_id must be unique');

TournamentSchema.path('_organizer').validate(function (_organizer, respond) {
    respond(this.isNew || !this.isModified('_organizer'));
}, '_organizer cannot be changed');

TournamentSchema.path('name').validate(function (name, respond) {
    respond(!this.isNew || /^[a-zA-Z0-9]+$/.test(name));
}, 'name must consist of alphanumerical characters');

TournamentSchema.path('name').validate(function (name, respond) {
    respond(this.isNew || !this.isModified('name'));
}, 'name cannot be changed');

TournamentSchema.path('name').validate(function (name, respond) {
    if (!this.isNew) {
        respond(true);
    } else {
        const Tournament = mongoose.model('Tournament');
        Tournament.find({_organizer: this._organizer}).exec(function (error, tournaments) {
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
    }
}, "name already exists for given organizer");

TournamentSchema.path('longName').validate(function (longName, respond) {
    const Tournament = mongoose.model('Tournament');
    Tournament.find({_organizer: this._organizer}).exec(function (error, tournaments) {
        if (error) {
            respond(false);
        } else {
            var first = true;
            for (var i = 0; i < tournaments.length; i++) {
                if (tournaments[i].name === name) {
                    if (first) {
                        first = false;
                    } else {
                        respond(false);
                    }
                }
            }
            respond(true);
        }
    })
}, "name already exists for given organizer");

TournamentSchema.path('type').validate(function (type, respond) {
    respond(this.isNew || !this.isModified('type'));
}, 'type cannot be changed');

mongoose.model('Tournament', TournamentSchema);
