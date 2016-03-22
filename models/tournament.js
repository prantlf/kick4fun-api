var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

TournamentSchema = new Schema({
    _id: {
        type: String,
        required: true//,
        //unique: true
    },
    description: {
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

TournamentSchema.path('_id').validate(function (_id, respond) {
    respond(this.isNew || !this.isModified('_id'));
}, '_id cannot be changed');

mongoose.model('Tournament', TournamentSchema);
